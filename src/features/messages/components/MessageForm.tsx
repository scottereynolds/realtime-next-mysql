"use client";

import { useState, type FormEvent } from "react";
import { CreateMessagePayload } from "@/types/message";
import { BaseCard, BaseCardContent, BaseCardHeader } from "@/components/MUI/Surface/BaseCard";
import { BaseTextField } from "@/components/MUI/Inputs/BaseTextField";
import { BaseButton } from "@/components/MUI/Inputs/BaseButton";
import { BaseStack } from "@/components/MUI/Layout/BaseStack";

type MessageFormProps = {
  defaultAuthor?: string;
  isSubmitting: boolean;
  onSubmit: (values: CreateMessagePayload) => Promise<void> | void;
};

export function MessageForm({
  defaultAuthor = "Scott",
  isSubmitting,
  onSubmit,
}: MessageFormProps) {
  const [author, setAuthor] = useState(defaultAuthor);
  const [content, setContent] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await onSubmit({
      author: author || "Anonymous",
      content,
    });

    // Only clear content; keep author sticky
    setContent("");
  };

  return (
    <BaseCard>
      <BaseCardHeader title="New Message" />
      <BaseCardContent>
        <form onSubmit={handleSubmit}>
          <BaseStack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <BaseTextField
              label="Author"
              size="small"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <BaseTextField
              label="Message content"
              size="small"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              sx={{ flex: 1, minWidth: 200 }}
            />
            <BaseButton
              type="submit"
              variant="contained"
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? "Saving..." : "Add Message"}
            </BaseButton>
          </BaseStack>
        </form>
      </BaseCardContent>
    </BaseCard>
  );
}
