import React, { useContext, useState } from "react";
import "./search.css";
import SearchIcon from "@mui/icons-material/Search";
import SingleConvo from "../SingleConvo/SingleConvo";
import Searchresult from "../searchresults/Searchresult";
import { userRequest } from "../../ApiCalls";
import { debounce } from "lodash";
import { userContext } from "../../contextApi/Usercontext";

const Search = ({setConvosUpdated}) => {
  const [searchUser, setSearchUser] = useState([]);
  const [searchBox, setSearchBox] = useState(false);
  const { data } = useContext(userContext);

  const handleSearch = async (e) => {
    const value = e.target.value;
    try {
      if (value) {
        setSearchBox(true);
        const res = await userRequest.post("/user/find", { username: value });
        setSearchUser(res.data);
      } else {
        setSearchUser([]); // Set searchUser to an empty array when the search input is empty
        setSearchBox(false); // removing the search results box
      }
    } catch (err) {
      console.log(err);
    }
  };

  const debouncedSearch = debounce(handleSearch, 200); // Adjust the debounce delay as needed (e.g., 300 milliseconds)

  return (
    <>
      <div className="search_container">
        <div className="search_bar">
          <input
            id="search"
            type="search"
            placeholder="Search or start new chat"
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
                <p>No results found</p>
              ) : (
                searchUser?.map(
                  (item) =>
                    item._id !== data.UserId && (
                      <Searchresult
                        username={item.username}
                        id={item._id}
                        url={item.url}
                        key={item._id}
                        box={setSearchBox}
                        setConvosUpdated={setConvosUpdated}
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
