import {
    Box,
    Image,
    Flex,
    Heading,
    Stack,
    VStack,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Text,
    IconButton,
    InputGroup,
    InputLeftElement,
    Input,
    Spinner,
    Center
  } from "@chakra-ui/react";
  import { useState, useEffect } from "react";
  import {
    RiAlertLine,
    RiArrowUpLine,
    RiFileList3Line,
    RiFireFill,
    RiHeartFill,
    RiHeartLine,
    RiInboxLine,
    RiSearchLine
  } from "react-icons/ri";
  
  import { useMediaQuery } from "react-responsive";
  
  import axios from "axios";
  import dayjs from "dayjs";
  /*
  ## 需求：
    - 電影列表：
      - 透過 API 取得電影資料，並顯示在畫面上
        - 資料來源：https://developers.themoviedb.org
        - API key：`ba9e9eb1cba46fa2c366ab90f70a5dbe` 
      - 當搜尋關鍵字為空值時，顯示熱門電影列表（Movie List UI）
        - API 文件：https://developers.themoviedb.org/3/movies/get-popular-movies
        - 預設顯示前 20 筆資料
      - 尚未載入資料前，顯示 Loading 畫面（Loading UI）
      - 若載入資料失敗，則需顯示 Error 畫面（Error UI）
      - 若沒有任何資料時，則顯示 Empty 畫面（Empty UI）
    - 完成 `Movie` component
      - 需顯示 `電影名稱`、`電影年份` 及 `加入願望清單` 按鈕（愛心符號的按鈕）
      - 按下 `加入願望清單` 按鈕後，會將該電影加入願望清單，且愛心符號變為實心
      - 再次按下 `加入願望清單` 按鈕後，會將該電影從願望清單中移除，且愛心符號會變為空心
      - 在網頁重新整理後，願望清單的內容仍須保留
    - 搜尋電影
      - API 文件：https://developers.themoviedb.org/3/search/search-movies
      - 可以在搜尋欄中輸入關鍵字查詢電影，同時將搜尋結果顯示在下方列表（Search Result UI）
      - 預設顯示前 20 筆搜尋結果
      - 沒有任何符合關鍵字的電影時，請顯示無搜尋結果畫面（Empty Search Result UI）
    - 願望清單
      - 點擊右上角的 `Wishlist` 按鈕可以打開願望清單
      - 清單中會顯示所有已加入願望清單的電影
      - 點擊任一電影的 `加入願望清單` 按鈕，即可將該電影從願望清單中移除
  ## 加分項目
    - 實作 Lazy load
      - 完成 `載入更多` 按鈕（Load More Button UI）
        - 當熱門電影或搜尋結果超過 20 筆資料時，請顯示 `載入更多` 按鈕在電影列表或搜尋結果的最下方
        - 點擊按鈕後會載入後 20 筆資料
        - 載入後續資料期間，按鈕須顯示為 Loading 狀態
        - 若所有資料皆已顯示完畢，此按鈕隨即消失
      - 完成 `回到頂部` 按鈕（GO to Top Button UI）
        - 按下按鈕時會向上捲動至熱門電影列表或搜尋結果列表的頂部
    - 重構 components
  ----------------
  ## Requirements:
    - Movie List
      - Render movie data
        - Data source: https://developers.themoviedb.org
        - API key：`ba9e9eb1cba46fa2c366ab90f70a5dbe` 
      - Show popular movies as default (without search keywords)
        - API document：https://developers.themoviedb.org/3/movies/get-popular-movies
        - Show top 20 records
      - Show loading UI before retrieving data from API
      - Show error UI if failed to retrieve data
      - Show empty UI if there isn't any data in the list
    - Complete the "Movie" component
      - Show "Title", "Production Year" and "Add to Wishlist" button (a heart icon button)
      - When user clicked on the heart icon button, the movie will be added to user's wishlist and the heart icon will become solid
      - If user clicked on a solid heart icon button, the movie will be removed from the wishlist
      - The movies in the wishlist will remain after user refreshed the page
    - Search movie
      - API document：https://developers.themoviedb.org/3/search/search-movies
      - User can search movies by entering keywords in the input field, the result will replace the original data in the movie list
      - Show top 20 records
      - Show empty result UI if there is no mated result
    - Wishlist
      - Clicking the "Wishlist" button on the top-right will open the wishlist modal
      - The list will display all movies that was added to the wishlist by the user
      - Clicking on the solid heart icon button on the movie will remove the corresponding movie from the wishlist
  ## Bonus
    - Lazy load
      - Implement "Load More" button
        - When Popular Movies or search results has more than 20 records, please show the “Load More” button at the bottom of the movie list or search result
        - Load 20 records after the Load More button is clicked
        - While loading the records, show Load More button in Loading state
        - If all records are fully displayed, the Load More button will disappear
      - Implement "Back to Top" button
        - Page will automatically scroll to top of the Popular Movies list or search result list after clicking the button
    - Refactor components
  */
    
  const Movie = (props) => {

    const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);

    const ToggleThisWishList = (index, status) => {
      setIsAddedToWishlist(!isAddedToWishlist);
      props.ToggleWishList(props.index, !isAddedToWishlist?"true":"false");
    };

    return (
      <Flex 
        w={props.isMobile||props.WishListMode?"full":"16%"} 
        align="center"
        bgColor="white" 
        borderRadius="md" 
        boxShadow="sm" 
        mb="8px"
      >
        <Flex 
          pos="relative" 
          direction={props.isMobile||props.WishListMode?"row":"column"}
          w="full"
          borderWidth="1px" 
          borderRadius="lg" 
          overflow="hidden"
        >
          <Box
            pos="relative" 
            w={props.isMobile||props.WishListMode?"25%":"full"}
            minW={props.isMobile||props.WishListMode?"25%":"full"}
            maxW={props.isMobile||props.WishListMode?"25%":"full"}
            pt={props.isMobile||props.WishListMode?"0":"140%"}
            overflowY="hidden"
            background="#f3f3f3"
            backgroundImage="url('http://demo.lilystar.cc/others/dmovie/img/pic.png')"
            backgroundSize="cover"
            backgroundPosition="top center"
            backgroundRepeat="no-repeat"
          >
            <Image
              pos="absolute"
              w="full"
              top="0"
              left="0"
              src={"https://image.tmdb.org/t/p/w500/" + props.item.poster_path}
            />
          </Box>
          <Box px="3" py="2">
            <Box
              mt="1"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated
            >
              <Text fontWeight="semibold" isTruncated>
                {props.item.title}
              </Text>
              <Text color="gray.400" fontSize="xs" isTruncated>
                {dayjs(props.item.release_date).format("YYYY")}
              </Text>
            </Box>
          </Box>
          <IconButton 
            pos={props.isMobile||props.WishListMode?"absolute":"relative"}
            right={props.isMobile||props.WishListMode?"0":"auto"} 
            variant="ghost"
            colorScheme="pink"
            icon={isAddedToWishlist ? <RiHeartFill /> : <RiHeartLine />}
            aria-label="edit"
            _focus={{ outline: "none" }}
            isRound={props.isMobile}
            onClick={() => ToggleThisWishList()}
          />
        </Flex>
      </Flex>
    );
  };
  
  const App = () => {
    
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [Loading, setLoading] = useState(true);
    const [Loaded, setLoaded] = useState(false);
    const [ErrorMsg, setErrorMsg] = useState("");

    const LocalMovieList = JSON.parse(localStorage.getItem('LocalMovieList')) || [];
    console.log('LocalMovieList', LocalMovieList);
    const [MovieList, setMovieList] = useState(LocalMovieList);

    const isMobile = useMediaQuery({
      query: "(max-width: 995px)"
    });

    const isLabtop = useMediaQuery({
      query: "(max-width: 1199px)"
    });
  
    //Get Movie List
    useEffect(() => {
      // Just run the first time
      console.log('render');
      console.log('useEffect=>MovieList', MovieList);
      if(MovieList.length===0){
        const api_key = "ba9e9eb1cba46fa2c366ab90f70a5dbe";
        axios.get(
          "https://api.themoviedb.org/3/movie/popular?api_key=" + api_key + "&language=en-US&page=1"
        )
        .then(async(res) => {
          console.log("res", res);
          setLoading(false);
          setErrorMsg("");
          if (res.data) { 
            //Add property
            let results = res.data.results
            results = results.map(obj => ({ ...obj, isWishList: "false"}));
            localStorage.setItem('LocalMovieList', JSON.stringify(results));
            await setMovieList(results);
            setLoaded(true);
          }
        })
        .catch((error) => {
          setLoading(false);
          if(error){
            console.log("error", error);
            setErrorMsg(error.message);
            setLoaded(true);
          }
        });
      }
    }, []);

    const ToggleWishList = (index, status) => { 
      console.log("ToggleWishList=>", index, status);
      MovieList[index].isWishList = status;
    };

    const move_list = MovieList.length>0?MovieList
    .map((item, index) => {
      return (
        <Movie 
          key={item.id} 
          item={item} 
          index={index}
          isMobile={isMobile} 
          isLabtop={isLabtop}    
          WishListMode={false}  
          ToggleWishList={ToggleWishList}
        />
      );
    }):[];

    const wish_list = MovieList.length>0?MovieList
    .filter(item => item.isWishList=== "true")
    .map((item, index) => {
      return (
        <Movie 
          key={item.id} 
          item={item} 
          index={index}
          isMobile={isMobile} 
          isLabtop={isLabtop}    
          WishListMode={true}  
          ToggleWishList={ToggleWishList}
        />
      );
    }):[];

    return (
      <Box bgColor="#f3f3f3" h="100vh">
        <Flex w="full" h="full" px="32px" pt="64px" direction="column">
          <Flex w="full" mb="32px" justify="space-between" align="center">
            <Heading fontSize="24px">Movies</Heading>
            <Button
              size="md"
              colorScheme="pink"
              leftIcon={<RiHeartLine />}
              onClick={onOpen}
            >
              Wishlist
            </Button>
          </Flex>
          <InputGroup mb="16px">
            <InputLeftElement
              pointerEvents="none"
              color="gray.500"
              children={<RiSearchLine />}
            />
            <Input type="tel" placeholder="Search Movies" bg="white" />
          </InputGroup>

          <VStack>
            
            {/* ----- Loading UI ----- */}
            {Loading?(
              <Center py="32px">
                <Spinner color="pink.600" />
              </Center>
            ):(
              null
            )}
    
            {/* ----- Error UI ----- */}
            {ErrorMsg.length>0?(
              <Center py="32px" color="pink.600" flexDirection="column">
                <Box fontSize="x-large" mb="8px">
                  <RiAlertLine />
                </Box>
                <Box>Something went wrong.</Box>
                <Box>The root cause could be: {ErrorMsg}</Box>
                <Box>Please try again later.</Box>
              </Center>
            ):(
              null
            )}

            {/* ----- Empty  UI ----- */}
            {Loaded && MovieList.length===0?(
            <Center py="32px" color="pink.600" flexDirection="column">
              <Box fontSize="x-large" mb="8px">
                <RiInboxLine />
              </Box>
              No data.
            </Center>
            ):(
              null
            )}

            {/* ----- Movie List (Popular movies) ------ */}
            <Flex
              fontWeight="600"
              color="pink.600"
              mb="8px"
              align="center"
              gap="4px"
            >
              <RiFireFill />
              Popular movies
            </Flex>
            <Flex
              w="full"
              minH="0"
              pb="32px"
              flex={1}
              direction={isMobile?"column":"row"} 
              wrap={isMobile?"nowrap":"wrap"}
              gap="11px"
            >
              {move_list}
            </Flex>

            {/* ----- Load More Button UI (Bonus) ------ */}
            <Center>
              <Button
                variant="ghost"
                size="md"
                colorScheme="blackAlpha"
                onClick={onOpen}
                isLoading={false} // set true while loading data
                loadingText="Loading"
              >
                Load More
              </Button>
            </Center>
          </VStack>
  
          {/* ----- Search Result UI ------ */}
          {/* <Flex
            fontWeight="600"
            color="pink.600"
            mb="8px"
            align="center"
            gap="4px"
          >
            <RiFileList3Line />
            Search result
          </Flex>
          <Stack
            w="full"
            minH="0"
            pb="32px"
            flex={1}
            overflowY="auto"
            spacing="8px"
          >
            <Movie />
          </Stack> */}
  
          {/* ----- Empty Result UI ----- */}
          {/* <Center py="32px" color="pink.600" flexDirection="column">
            <Box fontSize="x-large" mb="8px">
              <RiInboxLine />
            </Box>
            No matched result.
          </Center> */}
        </Flex>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bgColor="#f3f3f3">
            <ModalHeader>Wishlist</ModalHeader>
            <ModalCloseButton />
            <ModalBody p="32px">

              {wish_list.length===0?(
                <Center py="32px" color="pink.600" flexDirection="column">
                  <Box fontSize="x-large" mb="8px">
                    <RiInboxLine />
                  </Box>
                  Find your favorite movies!
                  <Button
                    mt="16px"
                    size="md"
                    variant="outline"
                    colorScheme="blackAlpha"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </Center>
              ):(
                <Stack>
                  {wish_list}
                </Stack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
  
        {/* ----- GO to Top Button UI (Bonus)  ------ */}
        {/* <IconButton
          pos="absolute"
          right="16px"
          bottom="24px"
          colorScheme="pink"
          icon={<RiArrowUpLine />}
          aria-label="edit"
          _focus={{ outline: "none" }}
          isRound
          onClick={() => {
            // TODO: Go to top
          }}
        /> */}
      </Box>
    );
  };
  
  export default App;
  