import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import UpdateNormalArticle from "./UpdateArticleType/UpdateNormalArticle";
import UpdateNewspaper from "./UpdateArticleType/UpdateNewspaper";
import { getAPIGetArticleById } from "../../../helpers/fakebackend_helper";
import UpdateAudioArticle from "./UpdateArticleType/UpdateAudioArticle";
import UpdateVideoArticle from "./UpdateArticleType/UpdateVideoArticle";
import { useScrollLock } from "../../../Components/Hooks/UseScrollLock";
import UpdateMagazine from "./UpdateArticleType/UpdateMagazine";
import UpdateShortVideoArticle from "./UpdateArticleType/UpdateShortVideoArticle";

const UpdateArticle = () => {
  const [detailData, setDetailData] = useState();
  const [reload, setReload] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const type = location.state?.type;
  const { lockScroll, unlockScroll } = useScrollLock();
  lockScroll();
  useEffect(() => {
    if (type === 5 || type === 4 || type === 3 || type === 1 || type === 11) {
      getAPIGetArticleById(id).then((res) => {
        if (res && res.status > 0) {
          setDetailData({
            ...res.data,
            article_category: res.data.category_id,
            article_author: res.data.author,
            article_content:
              res.data.list_file_info &&
              res.data.list_file_info.map((e) => {
                return {
                  image: `${e.file_url}`,
                  id: e.file_info_id,
                };
              }),
          });
        }
      });
    }
  }, [reload]);

  return (
    <>
      {type === 1 && <UpdateNormalArticle />}
      {type === 2 && <UpdateMagazine />}
      {type === 3 && detailData && (
        <UpdateShortVideoArticle
          typeVideo={"video"}
          detailData={detailData}
          setReload={() => setReload(!reload)}
        />
      )}
      {type === 4 && detailData && (
        <UpdateAudioArticle
          detailData={detailData}
          setReload={() => setReload(!reload)}
        />
      )}
      {type === 5 && detailData && (
        <UpdateNewspaper
          detailData={detailData}
          setReload={() => setReload(!reload)}
        />
      )}
      {type === 11 && detailData && (
        <UpdateShortVideoArticle
          typeVideo="short-video"
          detailData={detailData}
          setReload={() => setReload(!reload)}
        />
      )}
    </>
  );
};
export default UpdateArticle;
