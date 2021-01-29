import React, { useState, useEffect, useCallback, useRef } from 'react';
import LoadState from '../Enum/LoadState';

function CreateLoadingComponent(getData, defaultParams, notFoundErrorName, WrappedComponent) {
  return function LoadingComponent(props) {
    let mounted = useRef(true);
    let [ currentParams, changeCurrentParams ] = useState(defaultParams);
    let [ info, changeInfo ] = useState(null);
    let [ componentScreen, changeScreen ] = useState(LoadState.LOADING);

    const loadInfo = useCallback(async (params) => {
      changeScreen(LoadState.LOADING);

      try {
        const data = await getData(props, params);
        if(mounted.current) {
          changeInfo(data);
          changeCurrentParams(params);
          changeScreen(LoadState.DONE);
        }
      }
      catch(err) {
        if(err.name === notFoundErrorName) {
          if(mounted.current) {
            changeScreen(LoadState.NOT_FOUND);
          }
        }
        else {
          throw err;
        }
      }
    }, [props]);

    useEffect(() => {
      mounted.current = true;
      loadInfo(defaultParams);

      return () => {
        mounted.current = false;
      };
    }, [loadInfo]);

    return (
      <WrappedComponent otherProps={props} loadInfo={loadInfo} info={info}
                        screen={componentScreen} currentParams={currentParams} />
    );
  };
}

export default CreateLoadingComponent;
