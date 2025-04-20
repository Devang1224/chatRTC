import React, { useContext, useState } from "react";
import "./search.css";
import SearchIcon from "@mui/icons-material/Search";
import SingleConvo from "../SingleConvo/SingleConvo";
import Searchresult from "../searchresults/Searchresult";
import { userRequest } from "../../ApiCalls";
import { debounce } from "lodash";
import { userContext } from "../../contextApi/Usercontext";

const Search = () => {
  const [searchUser, setSearchUser] = useState([]);
  const [searchBox, setSearchBox] = useState(false);
  const { data } = useContext(userContext);

  const handleSearch = async (e) => {
    const value = e.target.value;
    try {
      if (value) {
        setSearchBox(true);
        const res = await userRequest.post("/user/find", { username: value });
        console.log("res",res)
        setSearchUser(res.data?.data);
      } else {
        setSearchUser([]); 
        setSearchBox(false); 
      }
    } catch (err) {
      console.log(err);
    }
  };

  const debouncedSearch = debounce(handleSearch, 200); 

  return (
    <>
      <div className="search_container">
        <div className="search_bar">
          <input
            id="search"
            type="search"
            placeholder="Search chats"
            onChange={debouncedSearch}
            onFocus={(event) => {
              event.target.setAttribute("autocomplete", "off");
            }}
          />
        </div>

        {searchBox && (
          <div className="search_results">
            {
              searchUser.length == 0 ? (
                <p style={{padding:'5px 10px'}}>No results found</p>
              ) : (
                searchUser?.map(
                  (item) =>
                    item._id !== data.userDetails?._id && (
                      <Searchresult
                        username={item.username}
                        id={item._id}
                        url={item.url}
                        key={item._id}
                        box={setSearchBox}
                      />
                    )
                )
              ) // dont display the currentuser in the searchlist
            }
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
