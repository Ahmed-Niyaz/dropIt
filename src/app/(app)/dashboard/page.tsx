"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { CheckIcon, CopyIcon, Dot, Loader2, RefreshCcw, X } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    // setFilteredMessages(messages.filter((message) => message._id !== messageId));
    setMessages(messages.filter((message) => message._id !== messageId));
    setFilteredMessages((prevFilteredMessages) =>
      prevFilteredMessages.filter((message) => message._id !== messageId)
    );
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, setValue, watch } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get("/api/get-messages");
        setMessages(response.data.messages || []);
        setFilteredMessages(response.data.messages || []);
        if (refresh) {
          setSearchQuery("");
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;

    fetchAcceptMessages();
    fetchMessages();
  }, [session, setValue, fetchMessages, fetchAcceptMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessage: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to update message settings",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/dropIt/${username}`;

  // const copyToClipboard = () => {
  //   navigator.clipboard.writeText(profileUrl);
  //   toast({
  //     title: "URL Copied!",
  //     description: "Profile URL has been copied to clipboard.",
  //   });
  // };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast({
      title: "URL Copied!",
      description: (
        <span>
          Profile URL{" "}
          <a
            href={profileUrl}
            target="_blank"
            className="underline text-blue-500"
          >
            {profileUrl}
          </a>{" "}
          has been copied to clipboard.
        </span>
      ),
    });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSearch = debounce((query: string) => {
    const filtered = messages.filter(
      (message) => message.content.toLowerCase().includes(query.toLowerCase()) // Assuming messages have a "content" property
    );
    setFilteredMessages(filtered);
  }, 300); // Debounce to prevent excessive function calls

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === "") {
      setFilteredMessages(messages);
    } else {
      handleSearch(query);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-3 mt-8 justify-center items-center">
        <Skeleton className="h-[500px] w-[80%] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </div>
    );
  }

  return (
    <div className="my-5 lg:mx-auto lg:max-w-[90%] xl:max-w-[1200px] p-6 shadow-2xl border rounded-lg w-full">
      <h1 className="text-4xl font-bold mb-4 text-center select-none">
        Dashboard
      </h1>

      <div className="flex items-center justify-between select-none">
        <div className="my-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold mr-2">Copy Your Unique Link</h2>{" "}
          <div className="flex items-center">
            {/* <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered p-2 mr-2"
            /> */}
            {/* <Button onClick={copyToClipboard}>Copy</Button> */}
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="flex items-center p-2"
            >
              {copied ? (
                <>
                  <CheckIcon className="w-3 h-3 text-green-500" />
                  {/* <span>Copied</span> */}
                </>
              ) : (
                <>
                  <CopyIcon className="w-3 h-3" />
                  {/* <span>Copy</span> */}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center select-none">
          <Dot
            className={`inline-block ${
              acceptMessages ? "text-green-500" : "text-red-500"
            } `}
            size={48}
          />
          <span className="mr-2 p-1">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
        </div>
      </div>
      <Separator className="mt-6 mb-4" />

      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          {/* Search Input */}
          <div className="flex justify-center items-center gap-2">
            <Input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded-md"
            />
            <Button
              onClick={() => {
                setSearchQuery(""); // Clear the search query
                setFilteredMessages(messages); // Reset to show all messages
              }}
              variant="outline"
            >
              <X />
            </Button>
          </div>
          <Button
            className="mt-4"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <MessageCard
                key={message._id as string}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="flex items-center justify-center col-span-full h-40">
              <p className="text-center">No messages to display.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
