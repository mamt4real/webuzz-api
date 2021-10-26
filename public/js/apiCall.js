import axios from "axios";
import { showAlert} from "./alert";

const baseUrl = `${location.protocol}//${location.host}/api/v1/`

export const apiCall = async (axiousOptions,callback,succcessMsg) => {
    const {data, url, method} = axiousOptions;
    try {
      const res = await axios({
        method,
        url: baseUrl + url,
        data
      });

      if (res.data.status === 'success' || res.status === 204) {
        showAlert("success",succcessMsg?succcessMsg:res.data.message);
        if(callback)
          callback();
      }
    } catch (err) {
      showAlert("error",err.response.data.message);
    }
  }

