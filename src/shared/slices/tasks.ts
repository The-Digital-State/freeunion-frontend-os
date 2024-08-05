import { createSlice } from '@reduxjs/toolkit';
import type { AppThunk } from 'redux';
import { getTasks, moveTask, getComments, addComment, getAdminTasks, getAdminColumn, getColumnTasks } from 'shared/services/tasks.service';
import cloneDeep from 'lodash/cloneDeep';
import { toast } from 'react-toastify';
import formatServerError from 'shared/utils/formatServerError';
import type { PayloadAction } from '@reduxjs/toolkit';

const ADMIN_COLUMNS = ['Предложения', 'Cписок дел', 'В работе', 'Выполнено', 'Не Выполнено'];

const defaultCardData = {
  name: '',
  description: '',
  checklist: [],
  image: null,
};

type TasksState = {
  columns: [];
  movingCardData: { cardId: string; columnId: number } | null;
  hideModalActions: boolean;
  cardData: {
    name: string;
    description: string;
    checklist: string[];
    image: string | null;
  };
  comments: [];
  visiability: {
    images: boolean;
    checklist: boolean;
  };
  filteredIds: number[];
  searchQuery: string;
};

const initialState = {
  columns: [],
  movingCardData: null,
  hideModalActions: false,
  cardData: defaultCardData,
  comments: [],
  visiability: {
    images: false,
    checklist: false,
  },
  filteredIds: [],
  searchQuery: '',
};

const slice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    resetCardData(state: TasksState): void {
      state.cardData = { ...defaultCardData };
    },
    setFilteredIds(state: TasksState, action: PayloadAction<number[]>): void {
      state.filteredIds = action.payload;
    },
    setSearchQuery(state: TasksState, action: PayloadAction<string>): void {
      state.searchQuery = action.payload;
    },
    setBoard(state: TasksState, action: any): void {
      const newColumns = action.payload;
      state.columns = newColumns;
    },
    setMovingCardData(state: TasksState, action: any): void {
      state.movingCardData = action.payload;
    },
    setComments(state: TasksState, action: any): void {
      state.comments = action.payload;
    },
    setCardData(state: TasksState, action: any): void {
      state.cardData = { ...state.cardData, [action.payload.key]: action.payload.value };
    },
    setAllCardData(state: TasksState, action: any): void {
      state.cardData = { ...state.cardData, ...action.payload };
    },
    setVisiability(state: TasksState, action: any): void {
      state.visiability = { ...state.visiability, [action.payload.key]: action.payload.value };
    },
    setHideModalActions(state: TasksState, action: PayloadAction<boolean>): void {
      state.hideModalActions = action.payload;
    },
  },
});

export const {
  setComments,
  setSearchQuery,
  setCardData,
  setVisiability,
  setAllCardData,
  setHideModalActions,
  setFilteredIds,
  resetCardData,
  setBoard
} = slice.actions;

export const { reducer } = slice;

export const getAllComments = (orgId, cardId): AppThunk => async (dispatch): Promise<void> => {
  try {
    const {
      data: { data },
    } = await getComments(orgId, cardId);
    dispatch(
      slice.actions.setComments(
        data
          .sort((a, b) => {
            return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          })
          .reverse()
      )
    );
  } catch (err) {
    console.error(err);
  }
};

export const getBoard = (orgId, isAdminApp): AppThunk => async (dispatch): Promise<void> => {
  let res = null
  if (isAdminApp) {
    res = await getAdminTasks(orgId)
  } else {
    res = await getTasks(orgId);
  }
  const { data: { data } } = res
  const newColumns = ADMIN_COLUMNS.map((name, index) => {
    const cards = data
      .filter((card) => index === card.column_id)

    return {
      name,
      id: index,
      cards,
    };
  });
  dispatch(slice.actions.setBoard(newColumns));
};

export const moveCard = ({ source, destination, draggableId, columns, orgId }): AppThunk => async (
  dispatch
): Promise<void> => {
  const newColumns = cloneDeep(columns);
  const cardIndex = newColumns[source.droppableId].cards.findIndex(({ id }) => `${id}` === draggableId);
  newColumns[destination.droppableId].cards.push(newColumns[source.droppableId].cards[cardIndex]);
  newColumns[source.droppableId].cards.splice(cardIndex, 1);
  // dispatch(slice.actions.setBoard(newColumns));
  dispatch(slice.actions.setMovingCardData({ cardId: draggableId, columnId: destination.droppableId }));
};

export const moveCardWithComment = ({ comment, orgId, isAdminApp }): AppThunk => async (dispatch, getState): Promise<void> => {
  try {
    const {
      tasks: { movingCardData },
    } = getState();
    if (comment) {
      await addComment(orgId, movingCardData.cardId, comment);
      await moveTask(orgId, movingCardData.cardId, movingCardData.columnId);
    }
    dispatch(slice.actions.setMovingCardData(null));
    await dispatch(getBoard(orgId, isAdminApp));
  } catch (error) {
    toast.error(formatServerError(error));
  }
};

export const addNewCard = (newCard): AppThunk => async (dispatch, getState): Promise<void> => {
  try {
    const {
      tasks: { columns },
    } = getState();
    const newColumns = cloneDeep(columns)
    newColumns[1] = { ...columns[1], cards: [newCard, ...columns[1].cards] }
    dispatch(slice.actions.setBoard(newColumns));
  } catch (error) {
    toast.error(formatServerError(error));
  }
};

export const getColumn = (orgId, columnId, isAdminApp): AppThunk => async (dispatch, getState): Promise<void> => {
  try {
    let res = null;
    const {
      tasks: { columns },
    } = getState();
    const newColumns = cloneDeep(columns)
    if (isAdminApp) {
      res = await getAdminColumn(orgId, columnId);
    } else {
      res = await getColumnTasks(orgId, columnId);
    }
    const { data: { data } } = res;

    newColumns[columnId].cards = data;
    dispatch(slice.actions.setBoard(newColumns));
  } catch (error) {
    toast.error(formatServerError(error));
  }
};

export default slice;
