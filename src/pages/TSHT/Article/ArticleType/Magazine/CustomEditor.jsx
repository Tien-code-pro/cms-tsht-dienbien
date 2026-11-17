import { el } from "date-fns/locale";

const ArticleCustomEditor = (
  textColor,
  backgroundColor,
  text,
  textAlign,
  cssImage,
  cssText,
  img,
  caption,
  justify,
  type,
  img1,
  img2,
  captionMultiImg,
  csswidthMultiImage
) => {
  const textEditor = (text, textAlign) => {
    return (
      text &&
      text != "" &&
      `<div style="margin-bottom: 20px;width:${cssText};"><div class="text-width-web *:my-[1rem]">${text}</div></div>`
    );
  };
  const renderMedia = (media) => {
    if (media.includes(".mp3")) {
      return `<audio controls="" src=${media} style="width: 100%;">
      <a href=${media}>Download audio</a>
      </audio>`;
    } else if (media.includes(".mp4")) {
      return `<video controls="controls" width="100%" >
      <source src=${media} type="video/mp4"
       data-mce-src=${media}></video>`;
    } else if (media) {
      return `<img width=100% src=${media} alt="" />`;
    } else {
      return "";
    }
  };

  const imageEditor = (img, caption) => {
    return img && img !== ""
      ? `<figure id="add_image_link" style="width:${cssImage};margin-bottom: 20px;">
      ${renderMedia(img)}
        <figcaption><span style="color: ${textColor};text-align:center">${caption}</span></figcaption>
        </figure>`
      : "";
  };

  const multyImageEditor = (img1, img2, caption, csswidthMultiImage) => {
    return !img1 && !img2
      ? ""
      : `<div className="multyImage">
      <div style=" display: flex; justify-content: space-between; width:${csswidthMultiImage}; margin:0 auto;">
      <figure
          className="image"
          id="add_image_link"
          style=" width: 49.9%; margin-bottom: 20px; "
        >
        ${renderMedia(img1)}
        </figure>
              <figure
          className="image"
          id="add_image_link"
          style="width: 49.9%; margin-bottom: 20px;"
        >
         ${renderMedia(img2)}
        </figure>
      </div><figcaption style="text-align: center;font-style: italic;margin-top: -14px;margin-bottom: 20px;"}>${caption}</figcaption>
      </div>`;
  };

  const styleBlock = (content, justify) => {
    return `<div style="display:flex;flex-direction:row;justify-content:${justify}">${content}</div>`;
  };
  return `<div style="background-color:${backgroundColor}">${styleBlock(
    type
      ? textEditor(text, textAlign) + imageEditor(img, caption)
      : imageEditor(img, caption) + textEditor(text, textAlign),
    justify
  )} ${multyImageEditor(
    img1,
    img2,
    captionMultiImg,
    csswidthMultiImage
  )}</div>`;
};

export default ArticleCustomEditor;
