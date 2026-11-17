import React, { useState } from "react";
import ContentMagazine from "./MagazineComponent/ContentMagazine";
import SettingMagazine from "./MagazineComponent/SettingMagazine";
import { Tabs } from "antd";

export default function Magazine() {
  const [isSave, setIsSave] = useState(1);
  const save = () => {
    setIsSave(isSave + 1);
  };
  const Item = [
    {
      key: "1",
      label: `Nội dung`,
      children: <ContentMagazine save={save} />,
    },
    {
      key: "2",
      label: `Thông tin bài viết`,
      children: <SettingMagazine isSave={isSave} />,
    },
  ];
  return <Tabs defaultActiveKey="2" items={Item} />;
}
