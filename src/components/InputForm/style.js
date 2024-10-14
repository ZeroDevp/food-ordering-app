import styled from "styled-components";
import { Input } from "antd";


export const WrapperInputStyle = styled(Input)`
    &.ant-input:focus {
    border-color: #ff5b6a;
    box-shadow: 0 0 0 2px rgba(255, 91, 106, 0.2);
  }
`;