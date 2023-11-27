import React, { useEffect, useState, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Box, Button, Typography, TextField } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { SongDetailsContext } from "../context/SongDetailsContext";
import {FileAdd} from '../components/fileAdd.jsx';
import {BasicSongInfoDisplay} from '../components/BasicSongInfoDisplay.jsx';
import {LicensingInfoDisplay} from '../components/LicensingInfoDisplay.jsx';
import {PublisherInfoDisplay} from '../components/PublisherInfoDisplay.jsx';
import {DataTableData} from '../context/DataTableContext.jsx';
import DisplayMediaListing from '../components/DisplayMediaListing.jsx';
import {InfoDisplayRow} from '../components/InfoDisplayRow.jsx';
import StatusDisplayEdit from '../components/StatusDisplayEdit.jsx';
import {getStatusInfoFromSongData} from '../helpers/utils.js';
import {
  basicInformationDefault,
  licensingInformationDefault,
  statusInformationDefault,
  publishingColumnMappedToHeaders
} from '../helpers/constants.js';
import {CommentDisplay} from '../components/CommentDisplay.jsx';
import {Thumbnail} from '../components/Thumbnail.jsx';

const publishingHeaders = [
  "ISRC",
  "HFA Song Code",
  "HFA-Mechanical-A Mix",
  "HFA-Mechanical-D Mix",
  "Territories",
  "Writer",
];

const publishingHeadersMappedToColumn = {
  ISRC: "ISRCCAMixVocal",
  "HFA Song Code": "HFASongCode",
  "HFA-Mechanical-A Mix": "MechanicalRegistrationNumberA",
  "HFA-Mechanical-D Mix": "MechanicalRegistrationNumberD",
  Territories: "Territories",
  Writer: "Writer",
};




const defaultLicensingInformationState = {
  ISRCCAMixVocal: "",
  HFASongCode: "",
  MechanicalRegistrationNumberA: "",
  MechanicalRegistrationNumberD: "",
  Writer: "",
}

const defaultBasicInfoState = {
  Title: "",
  Artist: "",
  Genre: "",
  SongNumber: "",
  SubGenre: "",
  BarIntro: "",
  SongKey: "",
  Duration: "",
  Mixes: "",
  MixRendered: "",
  SongReleaseYear: "",
  Description: "",
  ISRCCAMixVocal: "",
  HFASongCode: "",
  MechanicalRegistrationNumberA: "",
  MechanicalRegistrationNumberD: "",
  Writer: "",
}

const CreateSong = () => {

  try {
    const location = useLocation();
    const {
      generatedSets,
      addSong,
      addPublisher,
      uploadMediaFile,
      getDetailsForSong,
      createComment,
      getCommentsForSong,
      uploadThumbnail
    } =
      useContext(SongDetailsContext);
    const {addToRecentSongs, getData, nextTwentyCatalogNumbers, getSongNumbersWithoutRecords} = useContext(DataTableData);
    const [selectedFile, setSelectedFile] = useState(null);
    const [newComment, setNewComment] = useState('');

    const fileInputRef = useRef(null);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [generatedMedia, setGeneratedMedia] = useState([]);
    const [generatedMediaForUpload, setGeneratedMediaForUpload] = useState([]);

    const [publishersForUpload, setPublishersForUpload] = useState([]);

    const [licensingInfoDisplay, setLicensingInfoDisplay] = useState([]);
    const [licensingInformation, setLicensingInformation] = useState(licensingInformationDefault);

    const [distributionInformation, setDistributionInformation] = useState(statusInformationDefault);

    const [basicInformation, setBasicInformation] = useState(basicInformationDefault);

    const [thumbnailInformation, setThumbnailInformation] = useState({});
    const [thumbnailInformationForUpload, setThumbnailInformationForUpload] = useState(null);

    const [filesStagedForUpload, setFilesStagedForUpload] = useState({});
    const [comments, setComments] = useState([]);
    const [nextCatNumbersToSuggest, setNextCatNumbersToSuggest] = useState([]);
    const [nextCatSuggest, setNextCatSuggest] = useState(undefined);
    const [statusData, setStatusData] = useState({...statusInformationDefault, Status: 'Status1'});

    const [SaveProgress, setSaveProgress] = useState([]);

    const reset = () => {
      setLicensingInformation(licensingInformationDefault);
      setBasicInformation(basicInformationDefault);
      setDistributionInformation(statusInformationDefault)
      setFilesStagedForUpload({});
      setGeneratedMediaForUpload([])
      setPublishersForUpload([])
      setThumbnailInformationForUpload([])
      setThumbnailInformation({})
      setComments([])
      setStatusData({...statusInformationDefault, Status: 'Status1'})
      setSaveProgress([])
    }

    useEffect(() => {
            const setupNextCatalogNumbers = async () => {
        setNextCatNumbersToSuggest(nextTwentyCatalogNumbers)
        await getSongNumbersWithoutRecords()
            .then(res => {
              const nextNum = res?.shift()?.toString()?.padStart(5, '0')
              setNextCatNumbersToSuggest(res)
              setNextCatSuggest(nextNum)
            })
      }
      setupNextCatalogNumbers()

    }, []);

    useEffect(() => {
      return () => {
        const detailsInOrder = publishingHeaders.map((val) => {
          return {
            key: publishingHeadersMappedToColumn[val],
            value: licensingInformation[publishingHeadersMappedToColumn[val]],
          };
        });

        console.log('STM pages-SongDetails.jsx:118', detailsInOrder); // todo remove dev item
        setLicensingInfoDisplay(detailsInOrder);
      };
    }, [licensingInformation]);

    const handleChange = (e) => {
      const {name, value} = e.target;
      setBasicInformation((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleLicensingChange = (e) => {
      const {name, value} = e.target;
      console.log('STM pages-CreateSong.jsx:124', name, value); // todo remove dev item
      setLicensingInformation((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleDistributionChange = (e) => {
      const {name, value} = e.target;
      let useValue
      if(value === 'true'){
        useValue = true
      } else if(value === 'false'){
        useValue = false
      } else {
        useValue = value
      }
      setDistributionInformation((prev) => ({
        ...prev,
        [name]: useValue,
      }));
    }

    const incrementNextCatalogNumberSuggestion = () => {
      setNextCatNumbersToSuggest(prev => {
        setNextCatSuggest(prev.shift())
        return [...prev]
      })
    }

    const savePublisher = (data) => {
      setPublishersForUpload([...publishersForUpload, data]);
    };

    const handleThumbnailChange = (data) => {
      console.log('STM pages-CreateSong.jsx:195', data); // todo remove dev item
      console.log('STM pages-CreateSong.jsx:196', data.get('files')); // todo remove dev item
      setThumbnailInformationForUpload(data)
    }

    const addProgressItem = (item) => {
      setSaveProgress(prev => [
        ...prev,
        item
      ])
    }

    const handleCreateComment = async (commentContent) => {
      const copyComment = {
        SongNumber: basicInformation.SongNumber,
        Content: commentContent,
        UserName: 'Sample Username',
      };
      setComments((prev) => [copyComment, ...prev]);
      // setNewComment('');
    };

    const handleStatusChange = (e) => {
      const {name, value} = e.target;
      setStatusData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const uploadMediaFileAndForCreateSong = async (data) => {

      setGeneratedMediaForUpload([...generatedMediaForUpload, data]);
      let bucketName = ''
      let fileName = ''
      for (const thing of data.entries()) {
        if (thing[0] === 'bucketName') {
          bucketName = thing[1]
        }
        if(typeof thing[1] === 'object'){
          fileName = thing[1]?.name
          console.log('STM pages-CreateSong.jsx:150', thing[1]?.name); // todo remove dev item
        }
        console.log('STM components-fileAdd.jsx:23', typeof thing[1]); // todo remove dev item
      }

      setFilesStagedForUpload((prev) => {
        if(prev[bucketName]){
          const tempSet = new Set(prev[bucketName])
          tempSet.add(fileName)
          prev[bucketName] = Array.from(tempSet)
        } else {
          prev[bucketName] = [fileName]
        }
        return prev
      })
      console.log('STM pages-CreateSong.jsx:163', filesStagedForUpload); // todo remove dev item
      console.log('STM pages-CreateSong.jsx:165', generatedMediaForUpload); // todo remove dev item
    };



    const handleSongUpload = async () => {
      try {
        const SongNumber = basicInformation.SongNumber;

        if (!SongNumber) {
          return;
        }

        addProgressItem('Preparing to Create New Song Entry');
        // Add basic song data
        const newSongData = {
          ...basicInformation,
          ...licensingInformation,
          ...statusData,
          ...distributionInformation,
          Status: 'Status1'
        };
        await addSong(newSongData);

        addProgressItem('Create Song Metadata Entry Complete');

        addToRecentSongs(SongNumber);

        if(thumbnailInformationForUpload){
          try {
            addProgressItem('Add Thumbnail');
            await uploadThumbnail(thumbnailInformationForUpload);
            addProgressItem('Add Thumbnail Complete');
          } catch (e) {
            console.error(e)
            addProgressItem('Error Adding Thumbnail');
          }
        }


        addProgressItem('Adding Media Files');
        // Add Media
        for (let i = 0; i < generatedMediaForUpload.length; i++) {
          // for (const thing of generatedMediaForUpload[i].entries()) {
          // }
          try {
            await uploadMediaFile(generatedMediaForUpload[i]);
            addProgressItem(`Added Media File for Bucket: ${generatedMediaForUpload[i].get('bucketName')}`);
          } catch (e) {
            console.error(e);
            const erroredEntry = generatedMediaForUpload[i];
            addProgressItem(`Error Adding Media File ${erroredEntry.get(erroredEntry.get('bucketName'))?.name} for Bucket: ${erroredEntry.get('bucketName')}`);
          }
        }

        addProgressItem('Media Files Upload Complete');

        if (publishersForUpload.length > 0) {
          addProgressItem('Preparing to Add Publishers');
        }

        // Add Publishers
        for (let i = 0; i < publishersForUpload.length; i++) {

          try {
            publishersForUpload[i].SongNumber = SongNumber;
            await addPublisher(publishersForUpload[i]);
            addProgressItem('Publisher Added');
          } catch (e) {
            console.error(e);
            addProgressItem('Error Adding Publisher');
          }
        }
        if (publishersForUpload.length > 0) {
          addProgressItem('Add Publishers Complete');
        }


        if (comments.length > 0) {
          addProgressItem('Preparing to Add Comments');
        }
        // Add Comments
        for (let i = 0; i < comments.length; i++) {

          try {
            await createComment(comments[i]);
          } catch (e) {
            console.error(e);
          }
        }

        if (comments.length > 0) {
          addProgressItem('Add Comments Complete');
        }

        setLicensingInformation(licensingInformationDefault);
        setBasicInformation(defaultBasicInfoState);
        setFilesStagedForUpload({});
        incrementNextCatalogNumberSuggestion();
        console.log(basicInformation);
        addProgressItem('Refreshing Local Song Data');
        await getData();
        addProgressItem('Refreshing Local Song Data Complete');
        addProgressItem('New Song Creation Complete');
      } catch (e) {
        console.error(e)
        addProgressItem('New Song Creation Error');
        addProgressItem('May Have Failed to Create New Song Entry');
        addProgressItem("Song Creation Steps Above With 'Complete' Succeeded");
      }
    };

    // const handleCommentChange = (e) => {
    //   const {value} = e.target;
    //   console.log('STM pages-CreateSong.jsx:258', value); // todo remove dev item
    //   setNewComment(value);
    // };


    useEffect(() => {
      console.log(basicInformation);
    }, [basicInformation]);

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          py: 3,
          px: 5,
          gap: 5
        }}
      >
        {/* FIRST SECTION: TITLE AND BUTTONS */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Typography variant="h4">
            Create Song Entry
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row'
            }}
          >
            <Button
              variant="outlined"
              sx={{
                borderColor: 'gray',
                color: 'black',
                '&:hover': {
                  borderColor: '#F1EFEF',
                  backgroundColor: '#F5F7F8',
                },
              }}
            >
              Upload Another Song
            </Button>

            <Button
              variant="outlined"
              startIcon={<StarBorderIcon/>}
              sx={{
                borderColor: '#00b00e',
                backgroundColor: '#00b00e',
                marginLeft: '15px',
                color: 'white',
                '&:hover': {
                  borderColor: '#F1EFEF',
                  backgroundColor: '#86A789',
                },
              }}
            >
              Export
            </Button>
          </Box>
        </Box>

        {/* SECOND SECTION: DESCRIPTION */}
        <BasicSongInfoDisplay
          newSong
          handleChange={handleChange}
          basicInformation={basicInformation}
          nextCatNumberToSuggest={nextCatSuggest}
        />

        {/* THIRD SECTION: LICENSING INFORMATION VIEW/EDIT */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              mb: 3
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              Publishing Information
            </Typography>
            <Typography>Update the publishing information here</Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1
            }}
          >
            {Object.keys(licensingInformation).map((header, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '20%',
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>{publishingColumnMappedToHeaders[header]}</Typography>
                <TextField
                  size="small"
                  hiddenLabel
                  name={header.key}
                  onChange={handleLicensingChange}
                  value={licensingInformation[header.key]}
                  variant="outlined"
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* FOURTH SECTION: STATUSES */}
        <div className="w-full border border-gray-200">
        </div>
        <StatusDisplayEdit newSong statusData={statusData} handleChange={handleStatusChange}/>
        <div className="w-full border border-gray-200">
        </div>
        <InfoDisplayRow
          title="Status Information"
          subTitle="Update the status information here"
          infoToDisplay={distributionInformation}
          handleChange={handleDistributionChange}
          useDropDown
        />

        {/* FIFTH SECTION: PUBLISHER */}
        <div className="w-full border border-gray-200">
        </div>
        <PublisherInfoDisplay
          songNumber={basicInformation.SongNumber}
          saveNewPublisher={savePublisher}
          songPublishers={publishersForUpload}
          setSongPublishers={setPublishersForUpload}
        />

        {/* SIXTH SECTION: COMMENTS */}
        <div className="w-full border border-gray-200">
        </div>
        <CommentDisplay
          comments={comments}
          handleCreateComment={handleCreateComment}
        />

        {/* SEVENTH SECTION: THUMBNAIL */}
        <div className="w-full border border-gray-200">
        </div>
        <Thumbnail newSong songNumber={basicInformation.SongNumber} thumbnailObject={thumbnailInformation} uploadFile={handleThumbnailChange}/>

        {/* EIGHTH SECTION: MEDIA */}
        <div className="w-full border border-gray-200">
        </div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2
          }}
        >
          <Typography sx={{fontWeight: 'bold'}}>Media</Typography>
          {Object.keys(filesStagedForUpload).map((item, index) => (
            <div className="w-64 flex-col" key={index}>
              <Typography sx={{fontWeight: 'bold'}}>{item}</Typography>
              {filesStagedForUpload[item].map((fileItem, idx) => (
                <Typography key={idx}>{fileItem}</Typography>
              ))}
            </div>
          ))}
          <FileAdd
            newSong
            buttonOnly
            songNumber={basicInformation.SongNumber}
            submit={uploadMediaFileAndForCreateSong}
            buckets={generatedSets}
            hideHandler={() => {
              setShowFileUpload(false);
            }}
          />
          <DisplayMediaListing
            newSong
            songNumber={basicInformation.SongNumber}
            submit={uploadMediaFileAndForCreateSong}
            generatedSets={generatedSets}
          />
        </Box>

        {/* NINTH SECTION: RESET SAVE BUTTONS */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center'
          }}
        >
          <Button
              variant="outlined"
              sx={{
                marginRight: '15px',
                borderColor: '#FF6969',
                backgroundColor: '#FF6969',
                color: 'white',
                '&:hover': {
                  borderColor: '#FF6969',
                  backgroundColor: '#white',
                  color: '#FF6969',
                },
              }}
              onClick={reset}
            >
              Reset
            </Button>
            <Button
              variant="outlined"
              onClick={handleSongUpload}
              sx={{
                marginRight: '15px',
                borderColor: '#00b00e',
                backgroundColor: '#00b00e',
                color: 'white',
                '&:hover': {
                  borderColor: '#F1EFEF',
                  backgroundColor: '#86A789',
                },
              }}
            >
              Save
            </Button>
        </Box>
        <div className="w-[90%] mt-5 mb-10 flex flex-col items-center justify-end">
          {SaveProgress.map((messageEntry, index) => (
            <Typography key={index}>{messageEntry}</Typography>
          ))}
        </div>
      </Box>
    );
  } catch (e) {
    console.error(e)
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'CreateSong' Page Component</h1>
    )
  }
};

export default CreateSong;
