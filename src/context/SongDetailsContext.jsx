import React, {createContext, useContext, useEffect, useState} from 'react';
import {axiosBase, base_url} from '../helpers/requests.js';
import axios from 'axios';
import {DataTableData} from './DataTableContext.jsx';
import {UserContext} from './UserContext.jsx';
import {Alert, IconButton, Snackbar} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const SongDetailsContext = createContext(undefined);


const SongDetailsProvider = ({children}) => {
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const {getData, generatedSets, getExistingBuckets} = useContext(DataTableData);
  const {user} = useContext(UserContext);


  const handleNotifyOfError = (error) => {
    let message = 'A request or server error occurred'
    if(error?.response){
      if(error?.response?.data){
        message = error?.response?.data
      }
    } else {
      message = error.message
    }
    setSnackBarMessage(message)
    setOpenSnackBar(true)
  }

  const handleSnackBarClose = () => {
    setSnackBarMessage('')
    setOpenSnackBar(false)
  }

  const updateSong = async (data) => {
    console.log('STM context-SongDetailsContext.jsx:23', data); // todo remove dev item
    const result = await axiosBase({
      method: 'put',
      url: '/updateSong',
      data: data
    })
      .catch(error => {
        console.error(error?.response?.data?.message);
        handleNotifyOfError(error)
      });
    getData();
    return result.data;
  };

  const updateMediaMetadata = async (data) => {
    console.log('STM context-SongDetailsContext.jsx:23', data); // todo remove dev item
    const result = await axiosBase({
      method: 'put',
      url: '/updateGeneratedMediaMetaData',
      data: data
    })
      .catch(error => {
        console.error(error?.response?.data?.message);
        handleNotifyOfError(error)
      });
    getData();
    return result.data;
  };


  const createComment = async (data) => {
    data.UserId = user.UserId
    data.UserName = user.UserName
    const result = await axiosBase({
      method: 'post',
      url: '/createComment',
      data: data
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });

    return result.data;
  };

  const getCommentsForSong = async (SongNumber) => {
    const result = await axiosBase({
      method: 'get',
      url: '/getCommentsForSongNumber',
      params: {
        SongNumber
      }
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });

    return result.data;
  };

  const markCommentRemoved = async (CommentId) => {
    const result = await axiosBase({
      method: 'delete',
      url: '/removeComment',
      params: {
        CommentId
      }
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });

    return result.data;
  };

  const uploadMediaFile = async (data) => {
    const timeToUpload = Math.ceil(data.get(data.get('bucketName')).size/500)
    const result = await axiosBase({
      method: 'post',
      url: '/upload',
      timeout: timeToUpload,
      data: data
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });
    // getData();
    // getExistingBuckets()
    return result.data;
  };

  const addSong = async (data) => {
    const result = await axiosBase({
      method: 'post',
      url: '/addSong',
      data: data
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });

    return result.data;
  };

  const addPublisher = async (data) => {
    const result = await axiosBase({
      method: 'post',
      url: '/addPublisher',
      data: data
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });

    return result.data;
  };

  const removePublisher = async (data) => {
    const result = await axiosBase({
      method: 'post',
      url: '/removePublisher',
      data: data
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });

    return result.data;
  };

  const getCrossClearForSong = async (SongNumber) => {
    const result = await axiosBase({
      method: 'get',
      url: '/getCrossClearForSong',
      params: {
        SongNumber
      }
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });

    return result.data.result;
  };

  const removeGeneratedMediaEntry = async (requestString) => {
    const result = await axiosBase({
      method: 'post',
      timeout: 30000,
      url: '/removeGeneratedMediaEntry',
      data: {
        requestString: requestString
      }
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });
  }

  // getCrossClearForSong
  // removePublisher

  // addPublisher

  const getDetailsForSong = async (SongNumber) => {
    try {
      console.log('STM context-SongDetailsContext.jsx:82', SongNumber); // todo remove dev item
      const result = await axios.get(`${base_url}/catalogInternal?SongNumber=${SongNumber}`);
      return result.data.data[0];
    } catch (error) {
      console.error(error)
      handleNotifyOfError(error)
    }
  };

  // const open

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackBarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <SongDetailsContext.Provider value={{
      generatedSets,
      addPublisher,
      addSong,
      removePublisher,
      getDetailsForSong,
      uploadMediaFile,
      updateSong,
      createComment,
      getCommentsForSong,
      getCrossClearForSong,
      markCommentRemoved,
      updateMediaMetadata,
      removeGeneratedMediaEntry
    }}>
      {children}
      <Snackbar
        open={openSnackBar}
        autoHideDuration={12000}
        onClose={handleSnackBarClose}
        action={action}
      >
        <Alert severity="error" onClose={handleSnackBarClose}>{snackBarMessage}</Alert>
      </Snackbar>
    </SongDetailsContext.Provider>
  );

};


export default SongDetailsProvider;
