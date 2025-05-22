// import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector";
import { catalogData } from "../apis";

// ================ get Catalog Page Data  ================
export const getCatalogPageData = async (categoryId) => {
  let result = [];
  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      { categoryId }
    );

    if (!response?.data?.success)
      throw new Error("Could not Fetch Category page data");

    console.log("API'den dönen veri:", response?.data?.data);
    result = response?.data?.data;
  } catch (error) {
    console.log("API hatası:", error);
    result = null; // hata durumunda null yap
  }
  return result;
};
