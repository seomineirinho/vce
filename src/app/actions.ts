"use server";

import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const supabase = await createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        email: email,
      },
    },
  });

  console.log("After signUp", error);

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {
      const { error: updateError } = await supabase.from("users").insert({
        id: user.id,
        name: fullName,
        full_name: fullName,
        email: email,
        user_id: user.id,
        token_identifier: user.id,
        created_at: new Date().toISOString(),
      });

      if (updateError) {
        console.error("Error updating user profile:", updateError);
      }
    } catch (err) {
      console.error("Error in user profile creation:", err);
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const sendMessageAction = async (formData: FormData) => {
  const message = formData.get("message")?.toString();
  const conversationId = formData.get("conversationId")?.toString();

  if (!message) {
    return { error: "Mensagem é obrigatória" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Usuário não autenticado" };
  }

  try {
    let currentConversationId = conversationId;

    // Create new conversation if none exists
    if (!currentConversationId) {
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .insert({
          user_id: user.id,
          title: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
        })
        .select()
        .single();

      if (convError) {
        console.error("Error creating conversation:", convError);
        return { error: "Erro ao criar conversa" };
      }

      currentConversationId = conversation.id;
    }

    // Save user message
    const { error: userMsgError } = await supabase.from("messages").insert({
      conversation_id: currentConversationId,
      content: message,
      role: "user",
    });

    if (userMsgError) {
      console.error("Error saving user message:", userMsgError);
      return { error: "Erro ao salvar mensagem" };
    }

    // Get complete conversation history for AI memory
    const { data: messages } = await supabase
      .from("messages")
      .select("content, role")
      .eq("conversation_id", currentConversationId)
      .order("created_at", { ascending: true });

    // Call OpenAI API with full conversation history
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer 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`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente útil e amigável. Responda sempre em português brasileiro de forma clara e concisa. Você tem acesso ao histórico completo da conversa e pode referenciar mensagens anteriores quando relevante.",
          },
          ...(messages || []).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", response.status, response.statusText);
      return { error: "Erro ao processar resposta da IA" };
    }

    const aiResponse = await response.json();
    const aiMessage = aiResponse.choices[0]?.message?.content;

    if (!aiMessage) {
      return { error: "Resposta da IA não encontrada" };
    }

    // Save AI response
    const { error: aiMsgError } = await supabase.from("messages").insert({
      conversation_id: currentConversationId,
      content: aiMessage,
      role: "assistant",
    });

    if (aiMsgError) {
      console.error("Error saving AI message:", aiMsgError);
      return { error: "Erro ao salvar resposta da IA" };
    }

    return {
      success: true,
      conversationId: currentConversationId,
      message: aiMessage,
    };
  } catch (error) {
    console.error("Error in sendMessageAction:", error);
    return { error: "Erro interno do servidor" };
  }
};

export const getConversationsAction = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Usuário não autenticado" };
  }

  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("id, title, created_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching conversations:", error);
    return { error: "Erro ao buscar conversas" };
  }

  return { conversations };
};

export const getMessagesAction = async (conversationId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Usuário não autenticado" };
  }

  // Verify user owns this conversation
  const { data: conversation } = await supabase
    .from("conversations")
    .select("user_id")
    .eq("id", conversationId)
    .single();

  if (!conversation || conversation.user_id !== user.id) {
    return { error: "Conversa não encontrada" };
  }

  const { data: messages, error } = await supabase
    .from("messages")
    .select("id, content, role, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return { error: "Erro ao buscar mensagens" };
  }

  return { messages };
};

export const renameConversationAction = async (formData: FormData) => {
  const conversationId = formData.get("conversationId")?.toString();
  const newTitle = formData.get("newTitle")?.toString();

  if (!conversationId || !newTitle) {
    return { error: "ID da conversa e novo título são obrigatórios" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Usuário não autenticado" };
  }

  // Verify user owns this conversation
  const { data: conversation } = await supabase
    .from("conversations")
    .select("user_id")
    .eq("id", conversationId)
    .single();

  if (!conversation || conversation.user_id !== user.id) {
    return { error: "Conversa não encontrada" };
  }

  const { error } = await supabase
    .from("conversations")
    .update({ title: newTitle, updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  if (error) {
    console.error("Error renaming conversation:", error);
    return { error: "Erro ao renomear conversa" };
  }

  return { success: true };
};

export const deleteConversationAction = async (formData: FormData) => {
  const conversationId = formData.get("conversationId")?.toString();

  if (!conversationId) {
    return { error: "ID da conversa é obrigatório" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Usuário não autenticado" };
  }

  // Verify user owns this conversation
  const { data: conversation } = await supabase
    .from("conversations")
    .select("user_id")
    .eq("id", conversationId)
    .single();

  if (!conversation || conversation.user_id !== user.id) {
    return { error: "Conversa não encontrada" };
  }

  // Delete messages first (due to foreign key constraint)
  const { error: messagesError } = await supabase
    .from("messages")
    .delete()
    .eq("conversation_id", conversationId);

  if (messagesError) {
    console.error("Error deleting messages:", messagesError);
    return { error: "Erro ao excluir mensagens" };
  }

  // Delete conversation
  const { error: conversationError } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId);

  if (conversationError) {
    console.error("Error deleting conversation:", conversationError);
    return { error: "Erro ao excluir conversa" };
  }

  return { success: true };
};
