import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ShoppingItem, Filters } from "../types";
import {
  createItem,
  deleteItem,
  fetchItemsByUser,
  updateItem,
} from "../api/itemsApi";
import type { RootState } from "../store";

export interface ItemsState {
  items: ShoppingItem[];
  loading: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  filters: Filters;
}

const savedFilters = localStorage.getItem("view:filters");

const initialState: ItemsState = {
  items: [],
  loading: false,
  status: "idle",
  error: null,
  filters: savedFilters
    ? (JSON.parse(savedFilters) as Filters)
    : { q: "", sort: "name", order: "asc" },
};

// Thunks
export const fetchItemsThunk = createAsyncThunk(
  "items/fetchByUser",
  async (userId: number) => {
    const items = await fetchItemsByUser(userId);
    return items;
  }
);

export const createItemThunk = createAsyncThunk(
  "items/create",
  async (payload: Omit<ShoppingItem, "id" | "createdAt" | "updatedAt">) => {
    const item = await createItem(payload);
    return item;
  }
);

export const updateItemThunk = createAsyncThunk(
  "items/update",
  async ({ id, updates }: { id: number; updates: Partial<ShoppingItem> }) => {
    const item = await updateItem(id, updates);
    return item;
  }
);

export const deleteItemThunk = createAsyncThunk(
  "items/delete",
  async (id: number) => {
    await deleteItem(id);
    return id;
  }
);

// Slice
const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Filters>) {
      state.filters = action.payload;
      localStorage.setItem("view:filters", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemsThunk.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(
        fetchItemsThunk.fulfilled,
        (s, a: PayloadAction<ShoppingItem[]>) => {
          s.status = "succeeded";
          s.items = a.payload;
        }
      )
      .addCase(fetchItemsThunk.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message ?? "Failed to load items";
      })
      .addCase(
        createItemThunk.fulfilled,
        (s, a: PayloadAction<ShoppingItem>) => {
          // pushing item exactly as returned from API
          s.items.unshift(a.payload);
        }
      )

      .addCase(
        updateItemThunk.fulfilled,
        (s, a: PayloadAction<ShoppingItem>) => {
          const idx = s.items.findIndex((i) => i.id === a.payload.id);
          if (idx >= 0) s.items[idx] = a.payload;
        }
      )

      .addCase(deleteItemThunk.fulfilled, (s, a: PayloadAction<number>) => {
        s.items = s.items.filter((i) => i.id !== a.payload);
      });
  },
});

export const { setFilters } = itemsSlice.actions;
export const selectItems = (state: RootState) => state.items.items;
export const selectFilters = (state: RootState) => state.items.filters;
export default itemsSlice.reducer;
