import IconClose from "../../../../assets/images/IconClosePopup.png";
import IconBot from "../../../../assets/images/IconBotAnwser.png";
import IconUser from "../../../../assets/images/IconUserTyping.png";
import IconTyping from "../../../../assets/images/IconSentMess.png";
import "./compare-version.scss";
import OpenAI from "openai";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  updateChatGPTBot,
  updateChatGPTUSER,
} from "../../../../store/chat/action";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY; // CRA: process.env.REACT_APP_OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});
const ModalChatGPT = (props) => {
  const { handleModalClose } = props;
  const { chatGPTuser, chatGPTbot } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const ref = useRef(null);
  const handleAnswer = async (value) => {
    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: value }],
        model: "gpt-3.5-turbo-16k-0613",
      });
      dispatch(
        updateChatGPTBot([
          ...chatGPTbot,
          {
            value: chatCompletion?.choices[0].message.content || "",
            time: moment().format("DD/MM/YYYY hh:mm:ss"),
          },
        ]),
      );
      // setAnswer((pre) => [
      //   ...pre,
      //   {
      //     value: chatCompletion?.choices[0].message.content || "",
      //     time: moment().format("DD/MM/YYYY hh:mm:ss"),
      //   },
      // ]);
    } catch (e) {
      console.log("error", e);
    }
  };
  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [chatGPTbot, chatGPTuser]);
  return (
    <>
      <div className="Mchat">
        <button className="Mchat2">
          <img
            src={IconClose}
            alt="close"
            className="Mchat2-2"
            onClick={() => handleModalClose && handleModalClose()}
          />
        </button>
        <div className="Mchat3">
          <img src={IconBot} alt="IconBot" className="Mchat4" />
          <div className="Mchat5">Trợ lý biên tập nội dung</div>
        </div>
        <div className="Mchat9" id="Mchat9">
          {chatGPTuser &&
            chatGPTuser.map((e, i) => {
              return (
                <>
                  <div className="Mchat10">
                    <div className="Mchat11">
                      <div className="Mchat7">{e.value}</div>
                      <div className="Mchat8">{e.time}</div>
                    </div>
                    <img src={IconUser} alt="IconUser" className="Mchat12" />
                  </div>
                  <div className="Mchat6">
                    <img src={IconBot} alt="IconBot" className="Mchat14" />
                    <div className="Mchat13">
                      <div className="Mchat7">
                        {chatGPTbot[i]?.value ? (
                          chatGPTbot[i].value
                        ) : (
                          <LoadingOutlined width={60} height={60} />
                        )}
                      </div>
                      <div className="Mchat8">{chatGPTbot[i]?.time || ""}</div>
                    </div>
                  </div>
                </>
              );
            })}
          <div ref={ref}></div>
        </div>

        <div className="Mchat15">
          <input
            type="text"
            className="Mchat16"
            placeholder="Nhập từ tìm kiếm"
            onChange={(e) => setValue(e.target.value)}
            value={value}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAnswer(value);
                setValue("");
                dispatch(
                  updateChatGPTUSER([
                    ...chatGPTuser,
                    {
                      value: value,
                      time: moment().format("DD/MM/YYYY hh:mm:ss"),
                    },
                  ]),
                );
                var objDiv = document.getElementById("Mchat9");
                objDiv.scrollTop = objDiv.scrollHeight;
              }
            }}
          />
          <button className="Mchat18">
            <img
              src={IconTyping}
              alt="IconTyping"
              className="Mchat17"
              onClick={() => {
                handleAnswer(value);
                setValue("");
                dispatch(
                  updateChatGPTUSER([
                    ...chatGPTuser,
                    {
                      value: value,
                      time: moment().format("DD/MM/YYYY hh:mm:ss"),
                    },
                  ]),
                );
              }}
            />
          </button>
        </div>
      </div>
    </>
  );
};
export default ModalChatGPT;
