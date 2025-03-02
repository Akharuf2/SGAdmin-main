import { createContext, useReducer, useCallback } from "react";
import axios from "../../../utils/axios/v1/adminAxios";

const GET_OMB_SERVICES = "GET_OMB_SERVICES";
const SET_ERROR = "SET_ERROR";
const SET_CURRENT_STATUS = "SET_CURRENT_STATUS";
const SET_TOTAL_COUNT = "SET_TOTAL_COUNT";

const initialState = {
  wafEdges: null,
  from: 0,
  size: 5,
  total: 0,
  errMsg: null,
};

const WAFReducer = (state, action) => {
  switch (action.type) {
    case GET_OMB_SERVICES:
      return {
        ...state,
        wafEdges: action.payload.wafEdges,
      };
    case SET_CURRENT_STATUS:
      return {
        ...state,
        from: action.payload.from,
        size: action.payload.size,
      };
    case SET_TOTAL_COUNT:
      return {
        ...state,
        total: action.payload.total,
      };
    case SET_ERROR:
      return {
        ...state,
        errMsg: action.payload.errMsg,
      };
    default:
      return state;
  }
};

const OmbServiceContext = createContext(null);

function OmbServiceProvider({ children }) {
  const [state, dispatch] = useReducer(WAFReducer, initialState);

  const setErr = useCallback((msg) => {
    dispatch({
      type: SET_ERROR,
      payload: {
        errMsg: msg,
      },
    });
  }, []);
  const getWAF = useCallback(
    async (size, from, init = true) => {
      dispatch({
        type: GET_OMB_SERVICES,
        payload: {
          wafEdges: null,
        },
      });
      dispatch({
        type: SET_CURRENT_STATUS,
        payload: {
          from,
          size,
        },
      });
      if (init) {
        dispatch({
          type: SET_TOTAL_COUNT,
          payload: {
            total: 0,
          },
        });
      }
      try {
        const response = await axios.post("omb_service/point", {
          from,
          size,
        });
        dispatch({
          type: GET_OMB_SERVICES,
          payload: {
            wafEdges: response.data.data,
          },
        });
        dispatch({
          type: SET_TOTAL_COUNT,
          payload: {
            total: response.data.total,
          },
        });
      } catch (err) {
        setErr(err.message);
        dispatch({
          type: GET_OMB_SERVICES,
          payload: {
            wafEdges: [],
          },
        });
        dispatch({
          type: SET_TOTAL_COUNT,
          payload: {
            total: 0,
          },
        });
      }
    },
    [setErr]
  );

  const createWAF = useCallback(
    async (values) => {
      try {
        await axios.put("omb_service/point", values);
        getWAF(state.size, 0);
      } catch (err) {
        setErr(err.message);
      }
    },
    [getWAF, setErr, state.size]
  );

  const updateWAF = useCallback(
    async (wafID, values) => {
      try {
        await axios.post(`omb_service/point/${wafID}`, values);
        getWAF(state.size, 0);
      } catch (err) {
        setErr(err.message);
      }
    },
    [getWAF, setErr, state.size]
  );

  const deleteWAF = useCallback(
    async (wafID, remove) => {
      try {
        await axios.delete(`omb_service/point/${wafID}`, {
          data: { remove },
        });
        getWAF(state.size, 0);
      } catch (err) {
        setErr(err.message);
      }
    },
    [getWAF, setErr, state.size]
  );
  const restoreWAF = useCallback(
    async (wafID) => {
      try {
        await axios.patch(`omb_service/point/${wafID}`);
        getWAF(state.size, 0);
      } catch (err) {
        setErr(err.message);
      }
    },
    [getWAF, setErr, state.size]
  );
  const viewWAF = useCallback(
    async (wafID) => {
      try {
        const response = await axios.get(`omb_service/point/${wafID}`);
        return response.data;
      } catch (err) {
        setErr(err.message);
      }
    },
    [setErr]
  );
  return (
    <OmbServiceContext.Provider
      value={{
        ...state,
        getWAF,
        createWAF,
        updateWAF,
        deleteWAF,
        restoreWAF,
        viewWAF,
        setErr,
      }}
    >
      {children}
    </OmbServiceContext.Provider>
  );
}

export { OmbServiceContext, OmbServiceProvider };
