import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import BungalowIcon from "@mui/icons-material/Bungalow";
import BarChartIcon from "@mui/icons-material/BarChart";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {Link, useNavigate} from 'react-router-dom';
import {Button, Box, Typography} from '@mui/material';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import {useContext} from 'react';
import {DataTableData} from '../context/DataTableContext.jsx';
import {UserContext} from '../context/UserContext.jsx';

const drawerWidth = 240;

const internalNav = ["Home", "Dashboard", "crossDashboard", "Create Song", "Reports", "queryBuilder", "Users", "statusDashboard", "batchUpload"]
const externalNav = ["Home", "Dashboard"]

export default function SideNav() {
  const navigate = useNavigate();
  const { recentSongs } = useContext(DataTableData);
  const {userType, logoutUser, loggedIn} = useContext(UserContext);


  const navigateToRecentSong = (song) => {
    navigate("/songdata", { state: { SongNumber: song } });
  }

   if(!loggedIn){
    return (
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid lightgrey",
            display: 'flex',
            justifyContent: 'space-between'
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box>
          <Toolbar>
            <img src="/digitrax.png" alt="Digitrax" width="500" height="600" />
          </Toolbar>
          <List>
            {["Home"].map((text, index) => (
              <ListItem key={text}>
                <Link
                  to={(() => {
                    switch (index) {
                      case 0:
                        return "/";
                      default:
                        return "/";
                    }
                  })()}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      {(() => {
                        switch (index) {
                          case 0:
                            return <BungalowIcon />;
                          default:
                            return null;
                        }
                      })()}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </Link>

              </ListItem>
            ))}
          </List>

        </Box>
      </Drawer>
    );
  }

    return (
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid lightgrey",
            display: 'flex',
            justifyContent: 'space-between'
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box>
          <Toolbar>
            <img src="/digitrax.png" alt="Digitrax" width="500" height="600"/>
          </Toolbar>
          <List>
            {(userType === 'internal' ? internalNav : externalNav).map((text, index) => (
              <ListItem key={text}>
                <Link
                  to={(() => {
                    switch (index) {
                      case 0:
                        return "/";
                      case 1:
                        return "/dashboard";
                      case 2:
                        return "/crossDashboard";
                      case 3:
                        return "/createsong";
                      case 4:
                        return "/reports";
                      case 5:
                        return "/queryBuilder";
                      case 6:
                        return "/users";
                      case 7:
                        return "/statusDashboard";
                      case 8:
                        return "/batchUpload";
                      default:
                        return "/";
                    }
                  })()}
                  style={{textDecoration: "none", color: "inherit"}}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      {(() => {
                        switch (index) {
                          case 0:
                            return <BungalowIcon/>;
                          case 1:
                            return <BarChartIcon/>;
                          case 2:
                            return <BarChartIcon/>;
                          case 3:
                            return <CheckBoxIcon/>;
                          case 4:
                            return <CheckBoxIcon/>;
                          case 5:
                            return <CheckBoxIcon/>;
                          case 6:
                            return <AccountCircleIcon/>;
                          case 7:
                            return <BarChartIcon/>;
                          case 8:
                            return <BarChartIcon/>;
                          // case 4:
                          //   return <AccountCircleIcon />;

                          default:
                            return null;
                        }
                      })()}
                    </ListItemIcon>
                    <ListItemText primary={text}/>
                  </ListItemButton>
                </Link>

              </ListItem>
            ))}
            <ListItem
              onClick={logoutUser}
            >
              <ListItemButton>
                <ListItemIcon>
                  <LogoutIcon/>
                </ListItemIcon>
                <ListItemText primary="Logout"/>
              </ListItemButton>
            </ListItem>
          </List>

        </Box>
        <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>

        </Box>
        <Box
          sx={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <Typography sx={{fontWeight: "bold", paddingLeft: '30px'}}>
            Recent Songs
          </Typography>
          <List>
            {recentSongs.map((song, idx) => (
              <ListItem key={idx}
                        onClick={() => {
                          navigateToRecentSong(song)
                        }}
              >
                <ListItemButton>
                  <ListItemText primary={`C${song}`}/>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
          <Button
            startIcon={<SettingsSuggestIcon/>}
            sx={{
              borderColor: "gray",
              padding: 1.5,
              marginRight: 2,
              color: "#454545",
              "&:hover": {
                borderColor: "#F1EFEF",
                backgroundColor: "#F5F7F8",
              },
            }}
          >
            Settings
          </Button>
        </Box>
      </Drawer>
    );

}
