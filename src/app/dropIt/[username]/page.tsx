"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dot,
  Frown,
  Loader2,
  LoaderCircle,
  Send,
  SendHorizonal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCompletion } from "ai/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const { toast } = useToast();

  // const {
  //   complete,
  //   completion,
  //   isLoading: isSuggestLoading,
  //   error,
  // } = useCompletion({
  //   api: "/api/suggest-messages",
  //   initialCompletion: initialMessageString,
  // });

  const [genAiMessages, setGenAiMessages] = useState(
    parseStringMessages(initialMessageString)
  );

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isAcceptingMsg, setIsAcceptingMsg] = useState(true);
  const [isGenAIMessagesLoading, setIsGenAIMessagesLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGenAISuggestedMessages = async () => {
    setIsGenAIMessagesLoading(true);
    try {
      const response = await axios.get("/api/suggest-message");
      const result = parseStringMessages(response.data);
      setGenAiMessages(result);
    } catch (error) {
      console.error("Error getting messages from genAI", error);
      setGenAiMessages(parseStringMessages(initialMessageString));
      toast({
        title: "Error",
        description: "Error getting messages",
        variant: "destructive",
      });
    } finally {
      setIsGenAIMessagesLoading(false);
    }
  };

  // this one for streaming text type
  // const fetchSuggestedMessages = async () => {
  //   try {
  //     complete("");
  //   } catch (error) {
  //     console.error("Error fetching messages:", error);
  //     // Handle error appropriately
  //   }
  // };

  const checkIfUserAcceptingMessage = async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");

      if (!response.data.isAcceptingMessages) {
        setIsAcceptingMsg(false);
      }
    } catch (error) {
      console.log("Error trying to see if user is accepting message", error);
    }
  };
  useEffect(() => {
    checkIfUserAcceptingMessage();
  }, []);

  if (!isAcceptingMsg) {
    return (
      <div className="container mx-auto my-8 p-6 rounded max-w-4xl">
        <Alert>
          <Frown className="h-5 w-5" />
          <AlertTitle>Sorry!</AlertTitle>
          <AlertDescription>
            User @{username} is currently not accepting message, please try
            again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 p-6 shadow-2xl border rounded-lg">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>

      <div className="">
        <div className="flex flex-col items-center justify-around">
          <div className="w-full flex justify-center items-center">
            <div className="py-10 w-[80%]">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 p-2"
                >
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">
                          Send Anonymous Message to @{username}
                          <span className="text-sm block">
                            (Accepting Message)
                            <Dot
                              className="text-green-500 inline-block"
                              size={48}
                            />
                          </span>{" "}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your message here"
                            className="resize-none"
                            {...field}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                if (!isLoading && messageContent) {
                                  form.handleSubmit(onSubmit)();
                                }
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-center">
                    {isLoading ? (
                      <Button className="bg-green-400" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </Button>
                    ) : (
                      <Button
                        className="bg-green-400"
                        type="submit"
                        disabled={isLoading || !messageContent}
                      >
                        Send
                        <SendHorizonal />
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </div>

          {/* this is for ai suggested messages */}

          <div className="w-full max-w-[80%] space-y-4 my-8">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Button
                  onClick={fetchGenAISuggestedMessages}
                  className="my-4"
                  disabled={isGenAIMessagesLoading}
                >
                  Suggest Messages
                </Button>
                <ThemeToggle />
              </div>
              <p>Click on any message below to select it.</p>
            </div>
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Messages</h3>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                {isGenAIMessagesLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  genAiMessages.map((message) => (
                    <Button
                      key={message}
                      variant="outline"
                      className="mb-2 text-wrap md:text-lg text-xs"
                      onClick={() => handleMessageClick(message)}
                    >
                      {message}
                    </Button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="text-center">
          <div className="mb-4">Get Your Message Board</div>
          <Link href={"/sign-up"}>
            <Button>Create Your Account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
