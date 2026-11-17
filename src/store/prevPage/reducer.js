import { SET_DATA_PREV_PAGE } from "./actionType";

const INIT_STATE = {
  namePrevPage: "",
  dataPrevPage: null,
};

const PrevPage = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_DATA_PREV_PAGE: {
      const data = action.payload;
      return {
        ...state,
        namePrevPage: data.name,
        dataPrevPage: data.data,
      };
    }

    default:
      return { ...state };
  }
};

export default PrevPage;
