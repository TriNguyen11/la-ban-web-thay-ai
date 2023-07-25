import React from "react";
import { Lang, globalState } from "@floorplan/App";
import { Dropdown } from "react-bootstrap";
import Image from "next/image";

function Languages() {
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}>
      {children}
      &#x25bc;
    </a>
  ));
  const langs = globalState.getState().languages || {};
  if (Object.keys(langs).length == 0) {
    return <></>;
  }
  return (
    <Dropdown align="end">
      <Dropdown.Toggle as={CustomToggle}>
        <Image
          alt={"No image"}
          src={"storage/image/shares/language/" + Lang.getLanguage() + ".png"}
          width="15"
          height="15"
          className="me-1"
        />{" "}
        {langs[Lang.getLanguage()]}
      </Dropdown.Toggle>

      <Dropdown.Menu className="p-0 rounded-0">
        {Object.keys(langs).map((language_code, key) => (
          <Dropdown.Item
            key={key}
            onClick={() => {
              Lang.changeLanguage(language_code);
            }}>
            <Image
              alt={"No image"}
              src={"storage/image/shares/language/" + language_code + ".png"}
              width="15"
              height="15"
              className="me-1"
            />{" "}
            {langs[language_code]}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default Languages;
