import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Container,
  createTheme,
  CssBaseline,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
  ThemeProvider,
} from "@mui/material";
import {
  Fullscreen as FullscreenIcon,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import logo from "./logo.png";

// CUSTOM SETTINGS

const startFullscreen = process.env.START_FULLSCREEN || "1";

// style
const defaultTheme = process.env.DEFAULT_THEME || "16";

// custom / default theme
let bookmarkHeight = process.env.BOOKMARK_HEGHT || "150";
let bookmarkPadding = process.env.BOOKMARK_PADDING || "15";
let bookmarkRadius = process.env.BOOKMARK_RADIUS || "24";
let bookmarkWidth = process.env.BOOKMARK_WIDTH || "150";
let showCategories = process.env.SHOW_CATEGORIES || "1";
let showNames = process.env.SHOW_NAMES || "1";

switch (defaultTheme) {
  case "1": // homepage
    bookmarkHeight = "150";
    bookmarkPadding = "15";
    bookmarkRadius = "24";
    bookmarkWidth = "150";
    showCategories = "1";
    showNames = "1";
    break;
  case "2": // homepage compact
    bookmarkHeight = "150";
    bookmarkPadding = "15";
    bookmarkRadius = "24";
    bookmarkWidth = "150";
    showCategories = "1";
    showNames = "0";
    break;
  case "3": // homepage super compact
    bookmarkHeight = "150";
    bookmarkPadding = "15";
    bookmarkRadius = "24";
    bookmarkWidth = "150";
    showCategories = "0";
    showNames = "0";
    break;
  case "4": // homepage - small
    bookmarkHeight = "100";
    bookmarkPadding = "15";
    bookmarkRadius = "24";
    bookmarkWidth = "100";
    showCategories = "1";
    showNames = "1";
    break;
  case "5": // homepage compact - small
    bookmarkHeight = "100";
    bookmarkPadding = "15";
    bookmarkRadius = "24";
    bookmarkWidth = "100";
    showCategories = "1";
    showNames = "0";
    break;
  case "6": // homepage super compact - small
    bookmarkHeight = "100";
    bookmarkPadding = "15";
    bookmarkRadius = "24";
    bookmarkWidth = "100";
    showCategories = "0";
    showNames = "0";
    break;

  case "7": // homepage - round
    bookmarkHeight = "150";
    bookmarkPadding = "15";
    bookmarkRadius = "75";
    bookmarkWidth = "150";
    showCategories = "1";
    showNames = "1";
    break;
  case "8": // homepage compact - round
    bookmarkHeight = "150";
    bookmarkPadding = "15";
    bookmarkRadius = "75";
    bookmarkWidth = "150";
    showCategories = "1";
    showNames = "0";
    break;
  case "9": // homepage super compact - round
    bookmarkHeight = "150";
    bookmarkPadding = "15";
    bookmarkRadius = "75";
    bookmarkWidth = "150";
    showCategories = "0";
    showNames = "0";
    break;
  case "10": // homepage - small - round
    bookmarkHeight = "100";
    bookmarkPadding = "15";
    bookmarkRadius = "50";
    bookmarkWidth = "100";
    showCategories = "1";
    showNames = "1";
    break;
  case "11": // homepage compact - small - round
    bookmarkHeight = "100";
    bookmarkPadding = "15";
    bookmarkRadius = "50";
    bookmarkWidth = "100";
    showCategories = "1";
    showNames = "0";
    break;
  case "12": // homepage super compact - small - round
    bookmarkHeight = "100";
    bookmarkPadding = "15";
    bookmarkRadius = "50";
    bookmarkWidth = "100";
    showCategories = "0";
    showNames = "0";
    break;    
  case "13": // metro
    bookmarkHeight = "175";
    bookmarkPadding = "20";
    bookmarkRadius = "0";
    bookmarkWidth = "250";
    showCategories = "0";
    showNames = "0";
    break;
  case "14":
    bookmarkHeight = "200";
    bookmarkPadding = "10";
    bookmarkRadius = "24";
    bookmarkWidth = "200";
    showCategories = "0";
    showNames = "1";
    break;
  case "15": // widescreen
    bookmarkHeight = "125";
    bookmarkPadding = "20";
    bookmarkRadius = "4";
    bookmarkWidth = "225";
    showCategories = "1";
    showNames = "0";
    break;
       
  default: // custom
    break;
}

// Default theme
const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily:
      "SF Pro Text, system-ui, -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Arial, sans-serif",
  },
});

// Container for the app
const RootContainer = styled("div")(({ theme }) => ({
  backgroundColor: "black",
  minHeight: "100vh",
}));

// Container for the main content
const AppContainer = styled(Container)({
  alignItems: "flex-start",
  display: "flex",
  flexDirection: "column",
  margin: "0 !important",
  padding: "0 !important",
});

const BookmarkName = styled(Typography)({
  display: showNames === 'true' || showNames === '1' ? 'initial' : 'none',
  fontWeight: 'bold',
  margin: "0",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "100%",  
  // Apply 25% smaller font size on mobile phones
  [`@media ((max-device-width: 844px))`]: {
    fontSize: "75%",
    textOverflow: "initial",
  },  
});

// Container for the date and time display
const DateTimeContainer = styled(Box)({
  alignItems: "center",
  display: "flex",
});

// Fullscreen button
const FullscreenIconButton = styled(IconButton)({
  // Hide the IconButton for devices with a maximum device width of 844px
  [`@media (max-device-width: 844px)`]: {
    display: "none",
  },
});

// Container for the logo
const LogoContainer = styled(Box)({
  display: "flex",
  flex: 1,
  justifyContent: "center",
  // Hide logo on mobile phones
  [`@media ((max-device-width: 844px))`]: {
    display: "none",
  },  
});

// Container for each row of bookmarks
const RowContainer = styled(Box)({
  margin: '0 !important',  
  width: '100vw',
  padding: '0px 0px 0px 20px !important',
  overflowX: 'auto',
  flexShrink: 0, // Prevent the row from shrinking
  position: 'relative', // Add position relative to create a stacking context
});

// Title for each category
const CategoryTitle = styled(Typography)({
  display:
    showCategories === "true" || showCategories === "1" ? "initial" : "none",
  fontWeight: "bold",
  left: 0, // Stick the title to the left
  margin: "0 !important",
  lineHeight: "2",
  position: "sticky", // Make the title sticky
  zIndex: 1, // Set a higher z-index to make it appear above the scrolling content
  // smaller font size on mobile phones
  [`@media ((max-device-width: 844px))`]: {
    fontSize: "125%",
  },   
});

// List container for the bookmarks
const BookmarksList = styled(List)({
  display: "flex",
  overflowX: "scroll", // Enable horizontal scrolling
  padding: "0",
  scrollBehavior: "smooth", // Add smooth scroll behavior
  WebkitOverflowScrolling: "touch", // Enable smooth scrolling on iOS
  "&::-webkit-scrollbar": {
    height: "2px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#555", // Change scrollbar thumb color on hover
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#333", // Change scrollbar thumb color on hover
  },
  "&::-webkit-scrollbar-thumb:active": {
    background: "#222", // Change scrollbar thumb color on active
  },
  "&::-webkit-scrollbar-thumb:focus": {
    background: "#222", // Change scrollbar thumb color on focus
  },
  "&::-webkit-scrollbar-corner": {
    display: "none", // Hide scrollbar corner
  },
});

const BookmarkContent = styled("div")({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  marginBottom: "8px",
  textAlign: "center",
  whiteSpace: "nowrap",
  width: `${parseInt(bookmarkWidth) + parseInt(bookmarkPadding)}px`,
  // Apply 50% smaller width and height on mobile phones
  [`@media ((max-device-width: 844px))`]: {
    marginBottom: "4px",
    width: `${parseInt(bookmarkWidth / 2) + parseInt(bookmarkPadding / 2)}px`,
  },   
});

// Individual bookmark item
const BookmarkItem = styled(ListItem)({
  padding: "0px",
  width: "fit-content", 
});

// Image for each bookmark
const BookmarkImage = styled("img")({
  borderRadius: `${bookmarkRadius}px`,
  height: `${bookmarkHeight}px`,
  marginBottom: "8px",
  width: `${bookmarkWidth}px`,
  // Apply 50% smaller width and height on mobile phones
  [`@media ((max-device-width: 844px))`]: {
    borderRadius: `${bookmarkRadius / 2}px`,
    marginBottom: "4px",
    width: `${bookmarkWidth / 2}px`,
    height: `${bookmarkHeight / 2}px`,
  },  
});

const getFullscreenUrl = (currentUrl) => {
  const youtubeUrl = 'https://www.youtube.com/redirect?q=';
  const fullscreenUrl = youtubeUrl + encodeURIComponent(currentUrl);
  return fullscreenUrl;
};

const openFullscreen = (url) => {
  const currentUrl = window.location.origin + window.location.pathname + "?redirected=1";
  const fullscreenUrl = getFullscreenUrl(currentUrl);
  window.open(fullscreenUrl, "_self");
};

const checkFileExists = async (url) => {
  try {
    const response = await fetch(url, {
      method: "HEAD"
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

function App() {
  const [title] = useState("Homepage");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState(null); // State to hold the error message
  
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const fileExists = await checkFileExists("/bookmarks.json");
        if (!fileExists) {
          setError("File not found");
          return;
        }
  
        const response = await fetch("/bookmarks.json");
        if (!response.ok) {
          throw new Error("Error fetching bookmarks");
        }
        const data = await response.json();
        setBookmarks(data.categories);
        setError(null); // Reset the error state if the fetch is successful
      } catch (error) {
        if (error.message === 'Unexpected token \'<\', "<!DOCTYPE "... is not valid JSON') {
          setError("File may be missing or inaccessible. Error message: " + error.message || "Unknown error occurred");
        } else {
          setError(error.message || "Unknown error occurred");
        }
      }
    };
    
    fetchBookmarks();
  
    const hasQueryString = window.location.href.includes("redirected=1");
  
    if (
      (startFullscreen === "true" || startFullscreen === "1") &&
      !hasQueryString &&
      !theme.breakpoints.down("sm")
    ) {
      openFullscreen();
    }
    
  }, []);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = currentDateTime.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  useEffect(() => {
    document.title = title;
  }, [title]);  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RootContainer>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "#000000",
            color: "#ECECEC",
            boxShadow: "none",
            backgroundImage: "none",
          }}
        >
          <Toolbar>
            <DateTimeContainer>
              <Typography
                variant="body1"
                style={{ marginRight: "8px", fontWeight: "bold" }}
              >
                {formattedDate}
              </Typography>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {formattedTime}
              </Typography>
            </DateTimeContainer>
            <LogoContainer>
              <a href="https://www.paypal.com/donate/?hosted_button_id=XQMVL329W7M32" rel="noopener noreferrer">
                <img src={logo} alt="Homepage" style={{ width: "100px" }} />
              </a>
            </LogoContainer>

            <FullscreenIconButton
              color="inherit"
              onClick={openFullscreen}             
            >
              <FullscreenIcon />
            </FullscreenIconButton>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <AppContainer>
          {error ? ( // Display the error message if it exists
              <Typography variant="h6" color="error" align="center" style={{ padding: "20px" }}>
               <span>
              PLEASE FIX THE FOLLOWING ERROR IN BOOKMARKS.JSON:
              <br />
              {error}
            </span>
              </Typography>
            ) : (
              bookmarks.map((category) => (
                <RowContainer key={category.category}>
                  <CategoryTitle variant="h5">{category.category}</CategoryTitle>
                  <BookmarksList>
                    {category.bookmarks.map((bookmark) => (
                      <BookmarkItem
                        key={bookmark.name}
                        button
                        component="a"
                        href={bookmark.url}
                      >
                      <BookmarkContent>
                        <BookmarkImage
                          src={bookmark.image}
                          alt={bookmark.name}
                          style={{
                            objectFit: "cover",
                            background: bookmark.background || "transparent",
                            border: bookmark.border || "none",
                          }}
                        />
                        <BookmarkName variant="subtitle1">
                          {bookmark.name}
                        </BookmarkName>
                        </BookmarkContent>                                                
                      </BookmarkItem>
                    ))}
                  </BookmarksList>
                </RowContainer>
              ))
            )}
        </AppContainer>
      </RootContainer>
    </ThemeProvider>
  );
}

export default App;

