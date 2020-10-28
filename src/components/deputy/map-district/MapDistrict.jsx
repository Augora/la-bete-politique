import React, { useState, useMemo } from "react"
import ReactMapGL, { Source, Layer } from "react-map-gl"
import { Link } from "gatsby"
import "mapbox-gl/dist/mapbox-gl.css"
import { France, flyToBounds } from "components/maps/maps-utils"
import GEOJsonDistrict from "static/list-district.json"
import { retirerAccentsFR } from "utils/string-format/accent"
import Block from "components/deputy/_block/_Block"

export default function MapDistrict(props) {
  const {
    NomCirconscription,
    NumeroCirconscription,
    NumeroDepartement,
  } = props.deputy
  const [viewport, setViewport] = useState({})

  //récupère le polygone de la circonscription
  const districtPolygon = useMemo(() => {
    return GEOJsonDistrict.features.find((district) => {
      return district.properties.code_dpt
        ? district.properties.code_dpt === NumeroDepartement &&
            parseInt(district.properties.num_circ) === NumeroCirconscription
        : retirerAccentsFR(district.properties.nom_dpt.toLowerCase()) ===
            retirerAccentsFR(NomCirconscription.toLowerCase()) &&
            parseInt(district.properties.num_circ) === NumeroCirconscription
    })
  }, [NomCirconscription, NumeroCirconscription, NumeroDepartement])

  return (
    <Block
      title="Circonscription"
      type="map"
      color={props.color}
      size={props.size}
      circ={{
        region: NomCirconscription,
        circNb: NumeroCirconscription,
      }}
    >
      <div className="map__container">
        <ReactMapGL
          mapboxApiAccessToken="pk.eyJ1Ijoia29iYXJ1IiwiYSI6ImNrMXBhdnV6YjBwcWkzbnJ5NDd5NXpja2sifQ.vvykENe0q1tLZ7G476OC2A"
          mapStyle="mapbox://styles/mapbox/streets-v11"
          {...viewport}
          width="100%"
          height="100%"
          minZoom={2}
          dragRotate={false}
          doubleClickZoom={false}
          touchRotate={false}
          dragPan={false}
          touchZoom={false}
          scrollZoom={false}
          //appelé Au chargement de la page
          onLoad={() => {
            setViewport({
              latitude: France.center.lat,
              longitude: France.center.lng,
              zoom: 2,
            })
            flyToBounds(districtPolygon, viewport, setViewport)
          }}
          //appelé quand le viewport change - nécéssaire pour que la map bouge
          onViewportChange={(change) => setViewport(change)}
        >
          <Source type="geojson" data={districtPolygon}>
            <Layer
              type="fill"
              paint={{
                "fill-color": "#fff",
                "fill-opacity": 0.5,
              }}
            />
            <Layer
              type="line"
              paint={{
                "line-color": props.color,
                "line-width": 2,
                // "line-dasharray": [4, 2],
              }}
            />
          </Source>
          {districtPolygon?.properties?.code_dpt !== undefined ? (
            <Link
              to={`/map?codeDpt=${districtPolygon?.properties?.code_dpt}`}
              className="map__redirect"
            >
              Cliquer pour voir la carte entière
            </Link>
          ) : (
            <div className="map__redirect">
              Français hors de france pas encore implementés
            </div>
          )}
        </ReactMapGL>
      </div>
    </Block>
  )
}
