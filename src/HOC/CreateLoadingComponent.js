import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import LoadState from '../Enum/LoadState';

function CreateLoadingComponent(getData, defaultParams, notFoundErrorName, WrappedComponent) {
  return function LoadingComponent(props) {
    let mounted = useRef(true);
    let [ currentParams, changeCurrentParams ] = useState(defaultParams);
    let [ info, changeInfo ] = useState(null);
    let [ componentScreen, changeScreen ] = useState(LoadState.LOADING);

    const loadInfo = async (params) => {
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
    };

    const location = useLocation();
    useEffect(() => {
      mounted.current = true;
      loadInfo(defaultParams);

      return () => {
        mounted.current = false;
      };

      /* An incomplete set of dependencies is actually useful here, since
         making an API call each time props is updated is too expensive. The
         actual proper set of dependencies depends on the specific component
         returned. */
      // eslint-disable-next-line
    }, [props.staticKey, location]);

    return (
      <WrappedComponent otherProps={props} loadInfo={loadInfo} info={info}
                        screen={componentScreen} currentParams={currentParams} />
    );
  };
}

export default CreateLoadingComponent;
