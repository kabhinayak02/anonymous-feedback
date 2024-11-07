'use client'
import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Message } from "@/model/User.model"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch('acceptMessages');

  // toggle for accepting messages 
  const fetchAccpetMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive"
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  // fetch All the messages 
  const fetchAllMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      console.log(response);
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description: "Showing latest messages",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading, setMessages, toast]);

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchAllMessages();
    fetchAccpetMessage();

  }, [session, setValue, fetchAccpetMessage, fetchAllMessages, toast]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default'
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive"
      });
    }
  };

  if (!session || !session.user) {
    return <div> </div>;
  }

  const { username } = session.user as User;

  // todo: do more research to find the base url
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL coped",
      description: "Profile URL has been copied to clipboard"
    });
  };

  /*

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchAllMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-8 bg-gradient-to-br from-gray-50 to-white shadow-lg rounded-lg w-full max-w-5xl">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800">User Dashboard</h1>
  
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-3 text-gray-600">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-3 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700 mr-3"
          />
          <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={copyToClipboard}>
            Copy
          </Button>
        </div>
      </div>
  
      <div className="mb-6 flex items-center">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          className="transition-transform duration-300"
        />
        <span className="ml-3 text-lg font-medium text-gray-700">
          Accept Messages: {acceptMessages ? <span className="text-green-600">On</span> : <span className="text-red-500">Off</span>}
        </span>
      </div>
      <Separator className="my-8 border-gray-300" />
  
      <Button
        className="mt-6 bg-gray-200 text-gray-600 hover:bg-gray-300 shadow-md"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchAllMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        ) : (
          <RefreshCcw className="h-4 w-4 text-gray-500" />
        )}
      </Button>
  
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No messages to display.</p>
        )}
      </div>
    </div>
  );
  
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-gray-50 rounded-lg shadow-lg w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-3 mr-2 bg-white text-gray-700 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <Button onClick={copyToClipboard} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md">Copy</Button>
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          className="mr-2"
        />
        <span className="text-gray-700">
          Accept Messages: {acceptMessages ? <span className="text-green-500">On</span> : <span className="text-red-500">Off</span>}
        </span>
      </div>
      <div className="border-b border-gray-300 pb-4 mb-4"></div>

      <Button
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md flex items-center"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchAllMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <RefreshCcw className="h-4 w-4 mr-2" />
        )}
        Refresh Messages
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-gray-500">No messages to display.</p>
        )}
      </div>
    </div>
  );

 

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl w-full max-w-6xl border border-gray-700">
      <h1 className="text-4xl font-bold mb-6 text-white bg-clip-text">User Dashboard</h1>

      <div className="mb-6 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold mb-3 text-gray-300">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input w-full p-3 bg-gray-900/50 text-gray-300 border-gray-600 rounded-lg 
            focus:border-blue-500 focus:ring-blue-500/50 placeholder-gray-500"
          />
          <Button 
            onClick={copyToClipboard} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg
            transition-all duration-200 ease-in-out shadow-lg hover:shadow-blue-500/20"
          >
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-6 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center">
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
            className="mr-3"
          />
          <span className="text-gray-300">
            Accept Messages: {' '}
            {acceptMessages ? 
              <span className="text-emerald-400 font-medium">On</span> : 
              <span className="text-rose-400 font-medium">Off</span>
            }
          </span>
        </div>
      </div>

      <div className="border-b border-gray-700/50 my-6"></div>

      <div className="flex items-center justify-between mb-6">
        <Button
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2.5 px-5 rounded-lg
          transition-all duration-200 ease-in-out flex items-center space-x-2 border border-gray-700
          hover:border-gray-600 shadow-lg hover:shadow-gray-800/50"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchAllMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh Messages</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div className="text-gray-500 bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center">
            <p className="text-gray-400">No messages to display.</p>
          </div>
        )}
      </div>
    </div>
  );


  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-8 bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl rounded-lg w-full max-w-5xl">
      <h1 className="text-4xl font-extrabold mb-6 text-white">User Dashboard</h1>
  
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-3 text-gray-300">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-gray-200 shadow-inner mr-3"
          />
          <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300" onClick={copyToClipboard}>
            Copy
          </Button>
        </div>
      </div>
  
      <div className="mb-6 flex items-center">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          className="transition-transform duration-300"
        />
        <span className="ml-3 text-lg font-medium text-gray-300">
          Accept Messages: {acceptMessages ? <span className="text-green-400">On</span> : <span className="text-red-400">Off</span>}
        </span>
      </div>
      <Separator className="my-8 border-gray-600" />
  
      <Button
        className="mt-6 bg-gray-700 text-gray-200 hover:bg-gray-600 shadow-lg transition-colors duration-300"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchAllMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
        ) : (
          <RefreshCcw className="h-4 w-4 text-gray-400" />
        )}
      </Button>
  
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No messages to display.</p>
        )}
      </div>
    </div>
  );

  */

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-8 bg-[#212A31] rounded-xl shadow-2xl w-full max-w-6xl border border-[#748D92]/20">
      <h1 className="text-4xl font-bold mb-6 text-[#D3D9D4] bg-clip-text">User Dashboard</h1>

      <div className="mb-6 bg-[#2E3944] p-6 rounded-lg border border-[#748D92]/20">
        <h2 className="text-lg font-semibold mb-3 text-[#D3D9D4]">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input w-full p-3 bg-[#212A31] text-[#D3D9D4] border-[#748D92]/30 rounded-lg 
            focus:border-[#124E66] focus:ring-[#124E66]/50 placeholder-[#748D92]"
          />
          <Button 
            onClick={copyToClipboard} 
            className="bg-[#124E66] hover:bg-[#124E66]/80 text-[#D3D9D4] font-medium px-6 py-3 rounded-lg
            transition-all duration-200 ease-in-out shadow-lg hover:shadow-[#124E66]/20"
          >
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-6 bg-[#2E3944] p-6 rounded-lg border border-[#748D92]/20">
        <div className="flex items-center">
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
            className="mr-3"
          />
          <span className="text-[#D3D9D4]">
          Accept Messages: {acceptMessages ? <span className="text-green-400">On</span> : <span className="text-red-400">Off</span>}
          </span>
        </div>
      </div>

      <div className="border-b border-[#748D92]/20 my-6"></div>

      <div className="flex items-center justify-between mb-6">
        <Button
          className="bg-[#2E3944] hover:bg-[#124E66] text-[#D3D9D4] font-medium py-2.5 px-5 rounded-lg
          transition-all duration-200 ease-in-out flex items-center space-x-2 border border-[#748D92]/20
          hover:border-[#124E66] shadow-lg hover:shadow-[#124E66]/20"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchAllMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh Messages</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div className="text-[#748D92] bg-[#2E3944] p-6 rounded-lg border border-[#748D92]/20 text-center">
            <p>No messages to display.</p>
          </div>
        )}
      </div>
    </div>
  );
  
}

export default Page;