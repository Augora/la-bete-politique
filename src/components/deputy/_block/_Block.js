import React from "react"
import Header from "./Header"
import styled from "styled-components"
import IconWIP from "images/ui-kit/iconwip.svg"

const BlockFrame = styled.div`
  border-color: ${(props) => props.color};
`
const BlockBackground = styled.div`
  background-color: ${(props) => props.color};
`

export default function _Block(props) {
  return (
    <BlockFrame
      color={props.color}
      className={`deputy__block block__${props.type} deputy__block--${
        props.size ? props.size : "medium"
      }`}
    >
      <Header type={props.type} title={props.title} color={props.color} />
      {props.type === "general" ? (
        <BlockBackground
          color={props.color}
          className={`block__background ${props.type}__background`}
        />
      ) : null}

      <div
        className={`block__content ${props.type}__content ${
          props.wip ? "block__content--wip" : null
        }`}
      >
        {!props.wip ? (
          props.children
        ) : (
          <div className="wip__content">
            <p>Bloc en cours de construction</p>
            <div className="wip__svg-container">
              <IconWIP />
            </div>
          </div>
        )}
      </div>
    </BlockFrame>
  )
}
