import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Colors.css";

function Color() {
  const [colors, setColors] = useState([]);
  const [searchColor, setSearchColor] = useState("");
  const [filteredColors, setFilteredColors] = useState([]);

  console.log(searchColor);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/NishantChandla/color-test-resources/main/xkcd-colors.json"
        );
        setColors(response.data.colors);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };

    fetchColors();
  }, []);

  function colorDistance(color1, color2) {
    const [r1, g1, b1] = hexToRGB(color1);
    const [r2, g2, b2] = hexToRGB(color2);

    return Math.sqrt(
      (r1 - r2) * (r1 - r2) + (g1 - g2) * (g1 - g2) + (b1 - b2) * (b1 - b2)
    );
  }

  function hexToRGB(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [r, g, b];
  }

  function hexToHSL(hex) {
    let r = 0,
      g = 0,
      b = 0;

    if (hex.length == 4) {
      r = "0x" + hex[1] + hex[1];
      g = "0x" + hex[2] + hex[2];
      b = "0x" + hex[3] + hex[3];
    } else if (hex.length == 7) {
      r = "0x" + hex[1] + hex[2];
      g = "0x" + hex[3] + hex[4];
      b = "0x" + hex[5] + hex[6];
    }

    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max == min) {
      h = s = 0;
    } else {
      let diff = max - min;
      s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

      switch (max) {
        case r:
          h = (g - b) / diff + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / diff + 2;
          break;
        case b:
          h = (r - g) / diff + 4;
          break;
      }
      h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h},${s},${l}`;
  }

  const handleSearch = () => {
    if (!isValidColor(searchColor)) {
      alert("Invalid color!");
      return;
    }

    const sortedColors = [...colors].sort((a, b) => {
      return (
        colorDistance(searchColor, a.hex) - colorDistance(searchColor, b.hex)
      );
    });

    setFilteredColors(sortedColors.slice(0, 100));
  };

  function isValidColor(color) {
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbPattern = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;

    return hexPattern.test(color) || rgbPattern.test(color);
  }

  return (
    <div>
      <div>
        <label className="label">Colors</label>
        <div className="search-container">
          <input
            className="search-box "
            type="text"
            value={searchColor}
            onChange={(e) => setSearchColor(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
      {!colors ? (
        "Loading..."
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Color</th>
                <th className="name">Name</th>
                <th>Hex</th>
                <th className="rgb">RGB</th>
                <th className="hsl">HSL</th>
              </tr>
            </thead>
            <tbody>
              {filteredColors.length > 0
                ? filteredColors.map((color) => (
                    <tr key={color.hex}>
                      <td style={{ backgroundColor: color.hex }}></td>
                      <td className="color-name">{color.color}</td>
                      <td>{color.hex}</td>
                      <td className="rgb">{hexToRGB(color.hex)}</td>
                      <td className="hsl">{hexToHSL(color.hex)}</td>
                    </tr>
                  ))
                : colors.map((color) => (
                    <tr className="color" key={color.hex}>
                      <td style={{ backgroundColor: color.hex }}></td>
                      <td className="color-name">{color.color}</td>
                      <td>{color.hex}</td>
                      <td className="rgb">{hexToRGB(color.hex)}</td>
                      <td className="hsl">{hexToHSL(color.hex)}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Color;
