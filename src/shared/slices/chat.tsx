import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '../../redux';
import * as chatService from '../services/chat.service';
import { UserShort } from '../interfaces/user';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import React from 'react';
import toastStyles from 'shared/styles/Toast.module.scss';
import formatServerError from 'shared/utils/formatServerError';

export interface Thread {
  avatar: string;
  name: string;
  id: string;
  last_message: Message;
  is_blocked: boolean;
  is_muted: boolean;
  new_messages: number;
}
export interface Message {
  content: string;
  created_at: string;
  data: any[];
  id: number;
  me: boolean;
  name: string;
  type: string;
  is_seen: boolean;
  updated_at: string;
  senderType?: string;
  isPrevMessageMine?: boolean;
}

interface ChatState {
  activeThreadId?: string;
  messages: Message[];
  threads: Thread[];
  selectedMessages: number[];
  selectedMessageId: number | null;
  isSelectingMessagesMode: boolean;
  user: UserShort;
  organizationId: string;
  searchQuery: string;
  isThreadsLoaded: boolean;
  isReply: boolean;
  dialogOptions: {
    top: string;
    left: string;
    isOpen: boolean;
    isMessageModal: boolean;
  };
}

const initialState: ChatState = {
  activeThreadId: null,
  messages: [],
  selectedMessages: [],
  threads: [],
  selectedMessageId: null,
  isReply: false,
  user: null,
  isSelectingMessagesMode: false,
  organizationId: '',
  searchQuery: '',
  isThreadsLoaded: false,
  dialogOptions: {
    top: '',
    left: '',
    isOpen: false,
    isMessageModal: false,
  },
};

const transformMessages = (data) => {
  const messages = [];
  data.reverse().forEach((value) => {
    const newValue = { ...value };
    if (newValue.me) {
      newValue.senderType = 'user';
    } else {
      newValue.senderType = 'contact';
    }
    if (messages.length > 0 && messages[messages.length - 1].senderType === newValue.senderType) {
      newValue.isPrevMessageMine = true;
    } else {
      newValue.isPrevMessageMine = false;
    }
    messages.push(newValue);
  });
  return messages;
};

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages(state: ChatState, action: PayloadAction<Message[]>): void {
      state.messages = action.payload;
    },
    setThreads(state: ChatState, action: PayloadAction<Thread[]>): void {
      const threads = action.payload;
      state.threads = threads;
      state.isThreadsLoaded = true;
    },
    setIsSelectingMessagesMode(state: ChatState, action: PayloadAction<boolean>): void {
      state.selectedMessages = [];
      state.isSelectingMessagesMode = action.payload;
    },
    setIsReply(state: ChatState, action: PayloadAction<boolean>): void {
      state.isReply = action.payload;
    },
    setSelectedMessageId(state: ChatState, action: PayloadAction<number | null>): void {
      // state.isSelectingMessagesMode = false;
      state.selectedMessageId = action.payload;
    },
    setSelectedMessages(state: ChatState, action: PayloadAction<{ id: number; value: boolean }>): void {
      if (action.payload.value) {
        state.selectedMessages = [...state.selectedMessages, action.payload.id];
      } else {
        state.selectedMessages = state.selectedMessages.filter((id) => id !== action.payload.id);
      }
    },
    setActiveThreadId(state: ChatState, action: PayloadAction<string>): void {
      const threadId = action.payload;
      state.isSelectingMessagesMode = false;
      state.activeThreadId = threadId;
      state.dialogOptions.isOpen = false;
    },
    updateActiveThread(state: ChatState, action: PayloadAction<object>): void {
      state.threads = state.threads.map((thread) =>
        thread.id === state.activeThreadId ? { ...thread, ...action.payload } : thread
      );
    },
    setSearchQuery(state: ChatState, action: PayloadAction<string>): void {
      const threadId = action.payload;
      state.searchQuery = threadId;
    },
    resetActiveThread(state: ChatState): void {
      state.activeThreadId = null;
    },
    setMessagesViewed(state: ChatState): void {
      state.threads = state.threads.map(thread => thread.id === state.activeThreadId ? { ...thread, new_messages: 0 } : thread);
    },
    setOrganizationId(state: ChatState, action: PayloadAction<string>): void {
      state.organizationId = action.payload;
    },
    setUserData(state: ChatState, action: PayloadAction<any>): void {
      state.user = action.payload;
    },
    setDialogOptions(
      state: ChatState,
      action: PayloadAction<{
        top?: string;
        left?: string;
        isOpen?: boolean;
      }>
    ): void {
      state.dialogOptions = { ...state.dialogOptions, ...action.payload };
      if (state.isSelectingMessagesMode && !state.dialogOptions.isMessageModal) {
        state.isSelectingMessagesMode = false;
        state.selectedMessages = [];
      }
    },
  },
});

export const {
  reducer,
  actions: {
    setActiveThreadId,
    setSelectedMessageId,
    setSelectedMessages,
    setIsSelectingMessagesMode,
    setDialogOptions,
    resetActiveThread,
    setUserData,
    setOrganizationId,
    setSearchQuery,
    setIsReply,
    setMessagesViewed,
    setThreads,
    setMessages
  },
} = slice;

export const getMessages =
  (threadId: string): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    const {
      chat: { organizationId },
    } = getState();
    try {
      let responseData = null;
      if (organizationId) {
        const {
          data: { data },
        }: { data: { data: Message[] } } = await chatService.getOrgMessages(threadId, organizationId);
        responseData = data;
      } else {
        const {
          data: { data },
        }: { data: { data: Message[] } } = await chatService.getMessages(threadId);
        responseData = data;
      }
      dispatch(slice.actions.setMessages(transformMessages(responseData).reverse()));
    } catch (error) {
      console.error(error);
      toast(formatServerError(error));
    }
  };

export const sendMessage =
  (threadId: string, body: string, type: string): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    try {
      const {
        chat: { organizationId, messages, isReply, selectedMessageId, activeThreadId },
      } = getState();
      let formData = null;
      if (isReply && type === 'text') {
        formData = {
          type,
          content: body,
          data: [...messages.filter(({ id }) => id === selectedMessageId).map(({ content }) => content)],
        };
      } else {
        formData = new FormData();
        formData.append('type', type);
        formData.append('content', body);
      }
      let newMessage = {};
      if (organizationId) {
        const { data } = await chatService.createOrgMessage(threadId, formData, organizationId);
        newMessage = { ...data, is_seen: false };
      } else {
        const { data } = await chatService.createMessage(threadId, formData);
        newMessage = { ...data, is_seen: false };
      }
      if (activeThreadId === threadId) {
        dispatch(slice.actions.setMessages(transformMessages([newMessage, ...messages]).reverse()));
      }
      dispatch(getThreads());
      dispatch(setIsReply(false));
    } catch (error) {
      console.error(error);
      toast(formatServerError(error));
    }
  };

export const createThread =
  (id: string, type: string): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    const {
      chat: { organizationId, user, threads },
    } = getState();
    try {
      const reqData = {
        participants: [
          {
            type: organizationId ? 'organization' : 'user',
            id: organizationId ? organizationId : user.id,
          },
          {
            type,
            id,
          },
        ],
        is_direct: true,
        data: [],
      };
      let resData = null;
      if (organizationId) {
        const {
          data: { data },
        } = await chatService.createOrgConversation(reqData, organizationId);
        resData = data;
      } else {
        const {
          data: { data },
        } = await chatService.createConversation(reqData);
        resData = data;
      }
      if (!threads.find(({ id }) => id === resData.id)) {
        dispatch(slice.actions.setThreads([resData, ...threads]));
      }
      dispatch(setActiveThreadId(resData.id));
      dispatch(getMessages(resData.id));
    } catch (error) {
      toast(formatServerError(error));
    }
  };

export const deleteConversation =
  (threadId: string): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    try {
      const {
        chat: { organizationId, threads },
      } = getState();
      if (organizationId) {
        await chatService.deleteOrgConversation(threadId, organizationId);
      } else {
        await chatService.deleteConversation(threadId);
      }
      dispatch(setActiveThreadId(null));
      dispatch(slice.actions.setThreads(threads.filter((thread) => thread.id !== threadId)));
    } catch (error) {
      console.error(error);
      toast(formatServerError(error));
    }
  };

export const deleteMessage =
  (threadId: string, messageIds: string[]): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    try {
      const {
        chat: { organizationId, messages, threads, activeThreadId },
      } = getState();
      if (organizationId) {
        await Promise.all(
          messageIds.map((messageId) => {
            return chatService.deleteOrgMessage(threadId, messageId, organizationId);
          })
        );
      } else {
        await Promise.all(
          messageIds.map((messageId) => {
            return chatService.deleteMessage(threadId, messageId);
          })
        );
      }
      const newMessages = messages.filter((message) => !messageIds.includes(message.id));
      dispatch(slice.actions.setMessages(newMessages));
      const activeThread = threads.find(({ id }) => id === activeThreadId)
      if (activeThread && messageIds.includes(activeThread.last_message?.id)) {
        dispatch(slice.actions.setThreads(threads.map((thread) => {
          if (thread.id === activeThread.id) {
            return { ...thread, last_message: newMessages[0] };
          } 
          return thread
        })));
      }
    } catch (error) {
      console.error(error);
      toast(formatServerError(error));
    }
  };

export const getThreads =
  (): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    const {
      chat: { organizationId },
    } = getState();
    try {
      let responseData = null;
      if (organizationId) {
        const {
          data: { data },
        }: { data: { data: Thread[] } } = await chatService.getOrgConversations(organizationId);
        responseData = data;
      } else {
        const {
          data: { data },
        }: { data: { data: Thread[] } } = await chatService.getConversations();
        responseData = data;
      }
      dispatch(slice.actions.setThreads(responseData));
    } catch (error) {
      console.error(error);
      toast(formatServerError(error));
    }
  };

export const blockThread =
  (): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    const {
      chat: { organizationId, activeThreadId },
    } = getState();
    try {
      if (organizationId) {
        await chatService.blockOrgConversation(organizationId, activeThreadId);
      } else {
        await chatService.blockConversation(activeThreadId);
      }
      dispatch(getThreads());
    } catch (error) {
      console.error(error);
      toast(formatServerError(error));
    }
  };
export const unBlockThread =
  (): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    const {
      chat: { organizationId, activeThreadId },
    } = getState();
    try {
      if (organizationId) {
        await chatService.unBlockOrgConversation(organizationId, activeThreadId);
      } else {
        await chatService.unBlockConversation(activeThreadId);
      }
      dispatch(getThreads());
    } catch (error) {
      console.error(error);
      toast(formatServerError(error));
    }
  };

export const clearThread =
  (): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    const {
      chat: { organizationId, activeThreadId },
    } = getState();
    try {
      if (organizationId) {
        await chatService.clearOrgConversation(organizationId, activeThreadId);
      } else {
        await chatService.clearConversation(activeThreadId);
      }
      dispatch(slice.actions.setMessages([]));
    } catch (error) {
      console.error(error);
      toast(formatServerError(error));
    }
  };

export const muteThread =
  (): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    const {
      chat: { organizationId, activeThreadId },
    } = getState();
    try {
      if (organizationId) {
        await chatService.muteOrgConversation(organizationId, activeThreadId);
      } else {
        await chatService.muteConversation(activeThreadId);
      }
      dispatch(slice.actions.updateActiveThread({ is_muted: true }));
    } catch (error) {
      console.error(error);
      toast(formatServerError(error));
    }
    };

export const unmuteThread =
  (): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    const {
      chat: { organizationId, activeThreadId },
    } = getState();
    try {
      if (organizationId) {
        await chatService.unmuteOrgConversation(organizationId, activeThreadId);
      } else {
        await chatService.unmuteConversation(activeThreadId);
      }
      dispatch(slice.actions.updateActiveThread({ is_muted: false }));
    } catch (error) {
      console.error(error);
      toast(formatServerError(error));
    }
  };

export const addNewMessage =
  (data): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    await dispatch(getThreads());
    const {
      chat: { activeThreadId, threads },
    } = getState();
    const {
      payload: {
        title,
        content,
        data: { conversation_id },
      },
    } = data;

    const [thread] = threads.filter((thread) => thread.id === conversation_id);
    if (conversation_id === activeThreadId) {
      dispatch(getMessages(activeThreadId));
    } else if (!thread?.is_muted) {
      toast(
        <Link
          onClick={() => {
            dispatch(setActiveThreadId(conversation_id));
            dispatch(getMessages(conversation_id));
          }}
          to={'/chat'}
          className={toastStyles.notification}
        >
          <h6>{title}</h6>
          <p>{content}</p>
        </Link>
      );
    }
  };

export default slice;
