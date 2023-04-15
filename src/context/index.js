import React, {
    createContext, useContext, useMemo, useReducer
} from 'react';

const AppContext = createContext();

const reducer = (state, action) => {
    switch(action.type){
        case 'USER_ACTIVE': {
            return { ...state, userActive: action.value };
        }
        case 'SESION_ACTIVE': {
            return { ...state, sesionActive: action.value };
        }
        default:
            throw new Error('No existe el tipo seleccionado');
    }
}

const AppControllerProvider = ({ children }) => {
    const initialState = {
        user: null,
        sesionActive: false,
    };
    const [controller, dispatch] = useReducer(reducer, initialState);

    const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

const useAppController = () => {
    const context = useContext(AppContext);

    if(!context){
        throw new Error('No se pudo utilizar le contexto');
    }

    return context;
}

const setUserActive = (dispatch, value) => dispatch({ type: 'USER_ACTIVE', value });
const setSesionActive = (dispatch, value) => dispatch({ type: 'SESION_ACTIVE', value });

export {
    AppControllerProvider,
    useAppController,
    setUserActive,
    setSesionActive,
}