import React from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import Chart from "react-apexcharts";

import { CircularProgress, useTheme } from "@mui/material";

import useSite from "../../../../../hooks/user/useSite";
import { Card as MuiCard, CardContent, CardStyle } from "../../common/styled";

const Card = styled(MuiCard)`
  position: relative;
  border-radius: 3px;
  width: calc(100%- 258px);
  height: calc(40vw - 90px);
  ${CardStyle};
`;

const ChartWrapper = styled.div`
  height: 100%;
`;
const Root = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  min-height: 100%;
`;
const WAFDetectChart = ({ setCustomRangeConfirm, setTimeRange, setCustomDateRange }) => {
  const theme = useTheme();
  const { sigs, mls, sdsigs } = useSite();
  const [data, setData] = React.useState([
    {
      name: "Sense Defence Signature",
      data: [],
    },
    {
      name: "Machine Learning",
      data: [],
    },
    {
      name: "OWASP Signature",
      data: [],
    },
  ]);
  const [options, setOptions] = React.useState({
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      type: "datetime",
      categories: [],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    chart: {
      fontFamily: "Montserrat",
    },
    colors: [theme.palette.custom.blue.main, theme.palette.custom.yellow.main, theme.palette.custom.green.main],
  });

  React.useEffect(() => {
    var categories = [];
    var sigDatas = [];
    var mlDatas = [];
    var sdSigDatas = [];
    if (sigs?.length > 0) {
      sigs.forEach((sig) => {
        categories.push(sig.key_as_string);
      });
    }
    if (mls?.length > 0) {
      mls.forEach((ml) => {
        categories.push(ml.key_as_string);
      });
    }
    if (sdsigs?.length > 0) {
      sdsigs.forEach((sdsig) => {
        categories.push(sdsig.key_as_string);
      });
    }
    // Remove duplicated entries
    categories = Array.from(new Set(categories));
    categories.sort();
    if (categories.length > 0) {
      categories.forEach((cate) => {
        if (null === sigs || 0 === sigs.length) {
          sigDatas.push(0);
        } else {
          let sig = sigs.find((x) => x.key_as_string === cate);
          if (undefined === sig) {
            sigDatas.push(0);
          } else {
            sigDatas.push(sig.doc_count);
          }
        }

        if (null === mls || 0 === mls.length) {
          mlDatas.push(0);
        } else {
          let ml = mls.find((x) => x.key_as_string === cate);
          if (undefined === ml) {
            mlDatas.push(0);
          } else {
            mlDatas.push(ml.doc_count);
          }
        }

        if (null === sdsigs || 0 === sdsigs.length) {
          sdSigDatas.push(0);
        } else {
          let sig = sdsigs.find((x) => x.key_as_string === cate);
          if (undefined === sig) {
            sdSigDatas.push(0);
          } else {
            sdSigDatas.push(sig.doc_count);
          }
        }
      });
    }
    setData([
      {
        name: "Sense Defence Signature",
        data: sdSigDatas,
      },
      {
        name: "Machine Learning",
        data: mlDatas,
      },
      {
        name: "OWASP Signature",
        data: sigDatas,
      },
    ]);
    setOptions({
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      xaxis: {
        type: "datetime",
        categories: categories,
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
      chart: {
        fontFamily: "Montserrat",
        events: {
          zoomed: function (chartContext, { xaxis, yaxis }) {
            if (xaxis.min === undefined || xaxis.max === undefined) {
              setTimeRange("1d");
            } else {
              const from = new Date(xaxis.min);
              const to = new Date(xaxis.max);
              const month = String(from.getMonth() + 1).padStart(2, "0");
              const date = String(from.getDate()).padStart(2, "0");
              const year = String(from.getFullYear());
              const hour = String(from.getHours()).padStart(2, "0");
              const minute = String(from.getMinutes()).padStart(2, "0");
              const second = String(from.getSeconds()).padStart(2, "0");
              const _month = String(to.getMonth() + 1).padStart(2, "0");
              const _date = String(to.getDate()).padStart(2, "0");
              const _year = String(to.getFullYear());
              const _hour = String(to.getHours()).padStart(2, "0");
              const _minute = String(to.getMinutes()).padStart(2, "0");
              const _second = String(to.getSeconds()).padStart(2, "0");
              setTimeRange("custom");
              setCustomRangeConfirm(true);
              setCustomDateRange([
                year + "-" + month + "-" + date + "T" + hour + ":" + minute + ":" + second,
                _year + "-" + _month + "-" + _date + "T" + _hour + ":" + _minute + ":" + _second,
              ]);
            }
          },
        },
      },
      colors: [theme.palette.custom.blue.main, theme.palette.custom.yellow.main, theme.palette.custom.green.main],
    });
  }, [sigs, mls, sdsigs]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card sx={{ boxShadow: "none" }}>
      <CardContent sx={{ background: "white", height: "100%" }}>
        <ChartWrapper>
          {sigs === null || mls === null ? (
            <Root>
              <CircularProgress color="primary" />
            </Root>
          ) : (
            <Chart options={options} series={data} type="line" height={"100%"} />
          )}
        </ChartWrapper>
      </CardContent>
    </Card>
  );
};

export default withTheme(WAFDetectChart);
