import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import marker from "../../assets/img/TrongHieu-hearder.png";
import { Button } from "antd";

const contact = () => {
  const positions = [
    {
      id: 1,
      lat: 10.717516050847303,
      lng: 106.65423294908216,
      name: "Chi Nhánh 1",
      description: "Chi Nhánh 1",
    },
    {
      id: 2,
      lat: 10.721662174890023,
      lng: 106.66835916564695,
      name: "Chi Nhánh 2",
      description: "Chi Nhánh 2",
    },
    {
      id: 3,
      lat: 10.733961571575843,
      lng: 106.6558203952884,
      name: "Chi Nhánh 3",
      description: "Chi Nhánh 3",
    },
    {
      id: 4,
      lat: 10.738385,
      lng: 106.669952,
      name: "Chi Nhánh 3",
      description: "Chi Nhánh 3",
    },
  ];

  const center = [10.762622, 106.660172];
  const customIcon = L.icon({
    iconUrl: marker, // Đường dẫn đến hình ảnh icon
    iconSize: [38, 38], // Kích thước icon [chiều rộng, chiều cao]
    iconAnchor: [19, 38], // Điểm neo (anchor) [trái/phải, trên/dưới]
    popupAnchor: [0, -38], // Điểm xuất hiện popup [trái/phải, trên/dưới]
  });
  return (
    <div>
      <div className="container-fluid bg-light py-5">
        <div className="col-md-6 m-auto text-center">
          <h1 className="h1">Liên hệ với chúng tôi</h1>
          <p>
            Hãy liên hệ với chúng tôi nếu khách hàng có thắc mắc về dịch vụ món
            ăn của chúng tôi.
          </p>
        </div>
      </div>
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {positions.map((position) => (
          <Marker
            key={position.id}
            position={[position.lat, position.lng]}
            icon={customIcon}
          >
            <Popup>
              <b>{position.name}</b>
              <p>{position.description}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="container py-5">
        <div className="row py-5">
          <form className="col-md-9 m-auto" method="post">
            <div className="row">
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="inputname">Name</label>
                <input
                  type="text"
                  className="form-control mt-1"
                  id="name"
                  name="name"
                  placeholder="Name"
                />
              </div>
              <div className="form-group col-md-6 mb-3">
                <label htmlFor="inputemail">Email</label>
                <input
                  type="email"
                  className="form-control mt-1"
                  id="email"
                  name="email"
                  placeholder="Email"
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="inputsubject">Subject</label>
              <input
                type="text"
                className="form-control mt-1"
                id="subject"
                name="subject"
                placeholder="Subject"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="inputmessage">Message</label>
              <textarea
                className="form-control mt-1"
                id="message"
                name="message"
                placeholder="Message"
                rows="8"
              ></textarea>
            </div>
            <div className="row">
              <div className="col text-end mt-2">
                <Button type="primary" danger>
                  Gửi đi
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default contact;
