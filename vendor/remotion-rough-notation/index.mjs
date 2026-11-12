// src/Annotation.tsx
import { useMemo as useMemo3 } from "react";
import {
  Interactive,
  Freeze,
  Sequence,
  Internals
} from "remotion";

// src/create-annotation.tsx
import { createRef, useLayoutEffect, useMemo as useMemo2, useState as useState2 } from "react";
import { useCurrentFrame, useDelayRender } from "remotion";

// src/element-size.ts
import { useCallback, useEffect, useMemo, useState } from "react";
var useElementSize = (ref) => {
  const [size, setSize] = useState(() => {
    if (!ref.current) {
      return null;
    }
    const rect = ref.current.getClientRects();
    if (!rect[0]) {
      return null;
    }
    return {
      width: rect[0].width,
      height: rect[0].height,
      left: rect[0].x,
      top: rect[0].y
    };
  });
  const observer = useMemo(() => {
    if (typeof ResizeObserver === "undefined") {
      return null;
    }
    return new ResizeObserver((entries) => {
      const { target } = entries[0];
      const newSize = target.getClientRects();
      if (!newSize?.[0]) {
        setSize(null);
        return;
      }
      const { width, height } = newSize[0];
      setSize({
        width,
        height,
        left: newSize[0].x,
        top: newSize[0].y
      });
    });
  }, []);
  const updateSize = useCallback(() => {
    if (!ref.current) {
      return;
    }
    const rect = ref.current.getClientRects();
    if (!rect[0]) {
      setSize(null);
      return;
    }
    setSize((prevState) => {
      const isSame = prevState && prevState.width === rect[0].width && prevState.height === rect[0].height && prevState.left === rect[0].x && prevState.top === rect[0].y;
      if (isSame) {
        return prevState;
      }
      return {
        width: rect[0].width,
        height: rect[0].height,
        left: rect[0].x,
        top: rect[0].y
      };
    });
  }, [ref]);
  useEffect(() => {
    if (!observer) {
      return;
    }
    const { current } = ref;
    if (current) {
      observer.observe(current);
    }
    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [observer, ref, updateSize]);
  return useMemo(() => {
    if (!size) {
      return null;
    }
    return { ...size, refresh: updateSize };
  }, [size, updateSize]);
};

// ../paths/dist/esm/index.mjs
import { NoReactInternals } from "remotion/no-react";
import {
  interpolate
} from "remotion/no-react";
var tValues = [
  [],
  [],
  [
    -0.5773502691896257,
    0.5773502691896257
  ],
  [
    0,
    -0.7745966692414834,
    0.7745966692414834
  ],
  [
    -0.33998104358485626,
    0.33998104358485626,
    -0.8611363115940526,
    0.8611363115940526
  ],
  [
    0,
    -0.5384693101056831,
    0.5384693101056831,
    -0.906179845938664,
    0.906179845938664
  ],
  [
    0.6612093864662645,
    -0.6612093864662645,
    -0.2386191860831969,
    0.2386191860831969,
    -0.932469514203152,
    0.932469514203152
  ],
  [
    0,
    0.4058451513773972,
    -0.4058451513773972,
    -0.7415311855993945,
    0.7415311855993945,
    -0.9491079123427585,
    0.9491079123427585
  ],
  [
    -0.1834346424956498,
    0.1834346424956498,
    -0.525532409916329,
    0.525532409916329,
    -0.7966664774136267,
    0.7966664774136267,
    -0.9602898564975363,
    0.9602898564975363
  ],
  [
    0,
    -0.8360311073266358,
    0.8360311073266358,
    -0.9681602395076261,
    0.9681602395076261,
    -0.3242534234038089,
    0.3242534234038089,
    -0.6133714327005904,
    0.6133714327005904
  ],
  [
    -0.14887433898163122,
    0.14887433898163122,
    -0.4333953941292472,
    0.4333953941292472,
    -0.6794095682990244,
    0.6794095682990244,
    -0.8650633666889845,
    0.8650633666889845,
    -0.9739065285171717,
    0.9739065285171717
  ],
  [
    0,
    -0.26954315595234496,
    0.26954315595234496,
    -0.5190961292068118,
    0.5190961292068118,
    -0.7301520055740494,
    0.7301520055740494,
    -0.8870625997680953,
    0.8870625997680953,
    -0.978228658146057,
    0.978228658146057
  ],
  [
    -0.1252334085114689,
    0.1252334085114689,
    -0.3678314989981802,
    0.3678314989981802,
    -0.5873179542866175,
    0.5873179542866175,
    -0.7699026741943047,
    0.7699026741943047,
    -0.9041172563704749,
    0.9041172563704749,
    -0.9815606342467192,
    0.9815606342467192
  ],
  [
    0,
    -0.2304583159551348,
    0.2304583159551348,
    -0.44849275103644687,
    0.44849275103644687,
    -0.6423493394403402,
    0.6423493394403402,
    -0.8015780907333099,
    0.8015780907333099,
    -0.9175983992229779,
    0.9175983992229779,
    -0.9841830547185881,
    0.9841830547185881
  ],
  [
    -0.10805494870734367,
    0.10805494870734367,
    -0.31911236892788974,
    0.31911236892788974,
    -0.5152486363581541,
    0.5152486363581541,
    -0.6872929048116855,
    0.6872929048116855,
    -0.827201315069765,
    0.827201315069765,
    -0.9284348836635735,
    0.9284348836635735,
    -0.9862838086968123,
    0.9862838086968123
  ],
  [
    0,
    -0.20119409399743451,
    0.20119409399743451,
    -0.3941513470775634,
    0.3941513470775634,
    -0.5709721726085388,
    0.5709721726085388,
    -0.7244177313601701,
    0.7244177313601701,
    -0.8482065834104272,
    0.8482065834104272,
    -0.937273392400706,
    0.937273392400706,
    -0.9879925180204854,
    0.9879925180204854
  ],
  [
    -0.09501250983763744,
    0.09501250983763744,
    -0.2816035507792589,
    0.2816035507792589,
    -0.45801677765722737,
    0.45801677765722737,
    -0.6178762444026438,
    0.6178762444026438,
    -0.755404408355003,
    0.755404408355003,
    -0.8656312023878318,
    0.8656312023878318,
    -0.9445750230732326,
    0.9445750230732326,
    -0.9894009349916499,
    0.9894009349916499
  ],
  [
    0,
    -0.17848418149584785,
    0.17848418149584785,
    -0.3512317634538763,
    0.3512317634538763,
    -0.5126905370864769,
    0.5126905370864769,
    -0.6576711592166907,
    0.6576711592166907,
    -0.7815140038968014,
    0.7815140038968014,
    -0.8802391537269859,
    0.8802391537269859,
    -0.9506755217687678,
    0.9506755217687678,
    -0.9905754753144174,
    0.9905754753144174
  ],
  [
    -0.0847750130417353,
    0.0847750130417353,
    -0.2518862256915055,
    0.2518862256915055,
    -0.41175116146284263,
    0.41175116146284263,
    -0.5597708310739475,
    0.5597708310739475,
    -0.6916870430603532,
    0.6916870430603532,
    -0.8037049589725231,
    0.8037049589725231,
    -0.8926024664975557,
    0.8926024664975557,
    -0.9558239495713977,
    0.9558239495713977,
    -0.9915651684209309,
    0.9915651684209309
  ],
  [
    0,
    -0.16035864564022537,
    0.16035864564022537,
    -0.31656409996362983,
    0.31656409996362983,
    -0.46457074137596094,
    0.46457074137596094,
    -0.600545304661681,
    0.600545304661681,
    -0.7209661773352294,
    0.7209661773352294,
    -0.8227146565371428,
    0.8227146565371428,
    -0.9031559036148179,
    0.9031559036148179,
    -0.96020815213483,
    0.96020815213483,
    -0.9924068438435844,
    0.9924068438435844
  ],
  [
    -0.07652652113349734,
    0.07652652113349734,
    -0.22778585114164507,
    0.22778585114164507,
    -0.37370608871541955,
    0.37370608871541955,
    -0.5108670019508271,
    0.5108670019508271,
    -0.636053680726515,
    0.636053680726515,
    -0.7463319064601508,
    0.7463319064601508,
    -0.8391169718222188,
    0.8391169718222188,
    -0.912234428251326,
    0.912234428251326,
    -0.9639719272779138,
    0.9639719272779138,
    -0.9931285991850949,
    0.9931285991850949
  ],
  [
    0,
    -0.1455618541608951,
    0.1455618541608951,
    -0.2880213168024011,
    0.2880213168024011,
    -0.4243421202074388,
    0.4243421202074388,
    -0.5516188358872198,
    0.5516188358872198,
    -0.6671388041974123,
    0.6671388041974123,
    -0.7684399634756779,
    0.7684399634756779,
    -0.8533633645833173,
    0.8533633645833173,
    -0.9200993341504008,
    0.9200993341504008,
    -0.9672268385663063,
    0.9672268385663063,
    -0.9937521706203895,
    0.9937521706203895
  ],
  [
    -0.06973927331972223,
    0.06973927331972223,
    -0.20786042668822127,
    0.20786042668822127,
    -0.34193582089208424,
    0.34193582089208424,
    -0.469355837986757,
    0.469355837986757,
    -0.5876404035069116,
    0.5876404035069116,
    -0.6944872631866827,
    0.6944872631866827,
    -0.7878168059792081,
    0.7878168059792081,
    -0.8658125777203002,
    0.8658125777203002,
    -0.926956772187174,
    0.926956772187174,
    -0.9700604978354287,
    0.9700604978354287,
    -0.9942945854823992,
    0.9942945854823992
  ],
  [
    0,
    -0.1332568242984661,
    0.1332568242984661,
    -0.26413568097034495,
    0.26413568097034495,
    -0.3903010380302908,
    0.3903010380302908,
    -0.5095014778460075,
    0.5095014778460075,
    -0.6196098757636461,
    0.6196098757636461,
    -0.7186613631319502,
    0.7186613631319502,
    -0.8048884016188399,
    0.8048884016188399,
    -0.8767523582704416,
    0.8767523582704416,
    -0.9329710868260161,
    0.9329710868260161,
    -0.9725424712181152,
    0.9725424712181152,
    -0.9947693349975522,
    0.9947693349975522
  ],
  [
    -0.06405689286260563,
    0.06405689286260563,
    -0.1911188674736163,
    0.1911188674736163,
    -0.3150426796961634,
    0.3150426796961634,
    -0.4337935076260451,
    0.4337935076260451,
    -0.5454214713888396,
    0.5454214713888396,
    -0.6480936519369755,
    0.6480936519369755,
    -0.7401241915785544,
    0.7401241915785544,
    -0.820001985973903,
    0.820001985973903,
    -0.8864155270044011,
    0.8864155270044011,
    -0.9382745520027328,
    0.9382745520027328,
    -0.9747285559713095,
    0.9747285559713095,
    -0.9951872199970213,
    0.9951872199970213
  ]
];
var cValues = [
  [],
  [],
  [1, 1],
  [
    0.8888888888888888,
    0.5555555555555556,
    0.5555555555555556
  ],
  [
    0.6521451548625461,
    0.6521451548625461,
    0.34785484513745385,
    0.34785484513745385
  ],
  [
    0.5688888888888889,
    0.47862867049936647,
    0.47862867049936647,
    0.23692688505618908,
    0.23692688505618908
  ],
  [
    0.3607615730481386,
    0.3607615730481386,
    0.46791393457269104,
    0.46791393457269104,
    0.17132449237917036,
    0.17132449237917036
  ],
  [
    0.4179591836734694,
    0.3818300505051189,
    0.3818300505051189,
    0.27970539148927664,
    0.27970539148927664,
    0.1294849661688697,
    0.1294849661688697
  ],
  [
    0.362683783378362,
    0.362683783378362,
    0.31370664587788727,
    0.31370664587788727,
    0.22238103445337448,
    0.22238103445337448,
    0.10122853629037626,
    0.10122853629037626
  ],
  [
    0.3302393550012598,
    0.1806481606948574,
    0.1806481606948574,
    0.08127438836157441,
    0.08127438836157441,
    0.31234707704000286,
    0.31234707704000286,
    0.26061069640293544,
    0.26061069640293544
  ],
  [
    0.29552422471475287,
    0.29552422471475287,
    0.26926671930999635,
    0.26926671930999635,
    0.21908636251598204,
    0.21908636251598204,
    0.1494513491505806,
    0.1494513491505806,
    0.06667134430868814,
    0.06667134430868814
  ],
  [
    0.2729250867779006,
    0.26280454451024665,
    0.26280454451024665,
    0.23319376459199048,
    0.23319376459199048,
    0.18629021092773426,
    0.18629021092773426,
    0.1255803694649046,
    0.1255803694649046,
    0.05566856711617366,
    0.05566856711617366
  ],
  [
    0.24914704581340277,
    0.24914704581340277,
    0.2334925365383548,
    0.2334925365383548,
    0.20316742672306592,
    0.20316742672306592,
    0.16007832854334622,
    0.16007832854334622,
    0.10693932599531843,
    0.10693932599531843,
    0.04717533638651183,
    0.04717533638651183
  ],
  [
    0.2325515532308739,
    0.22628318026289723,
    0.22628318026289723,
    0.2078160475368885,
    0.2078160475368885,
    0.17814598076194574,
    0.17814598076194574,
    0.13887351021978725,
    0.13887351021978725,
    0.09212149983772845,
    0.09212149983772845,
    0.04048400476531588,
    0.04048400476531588
  ],
  [
    0.2152638534631578,
    0.2152638534631578,
    0.2051984637212956,
    0.2051984637212956,
    0.18553839747793782,
    0.18553839747793782,
    0.15720316715819355,
    0.15720316715819355,
    0.12151857068790319,
    0.12151857068790319,
    0.08015808715976021,
    0.08015808715976021,
    0.03511946033175186,
    0.03511946033175186
  ],
  [
    0.2025782419255613,
    0.19843148532711158,
    0.19843148532711158,
    0.1861610000155622,
    0.1861610000155622,
    0.16626920581699392,
    0.16626920581699392,
    0.13957067792615432,
    0.13957067792615432,
    0.10715922046717194,
    0.10715922046717194,
    0.07036604748810812,
    0.07036604748810812,
    0.03075324199611727,
    0.03075324199611727
  ],
  [
    0.1894506104550685,
    0.1894506104550685,
    0.18260341504492358,
    0.18260341504492358,
    0.16915651939500254,
    0.16915651939500254,
    0.14959598881657674,
    0.14959598881657674,
    0.12462897125553388,
    0.12462897125553388,
    0.09515851168249279,
    0.09515851168249279,
    0.062253523938647894,
    0.062253523938647894,
    0.027152459411754096,
    0.027152459411754096
  ],
  [
    0.17944647035620653,
    0.17656270536699264,
    0.17656270536699264,
    0.16800410215645004,
    0.16800410215645004,
    0.15404576107681028,
    0.15404576107681028,
    0.13513636846852548,
    0.13513636846852548,
    0.11188384719340397,
    0.11188384719340397,
    0.08503614831717918,
    0.08503614831717918,
    0.0554595293739872,
    0.0554595293739872,
    0.02414830286854793,
    0.02414830286854793
  ],
  [
    0.1691423829631436,
    0.1691423829631436,
    0.16427648374583273,
    0.16427648374583273,
    0.15468467512626524,
    0.15468467512626524,
    0.14064291467065065,
    0.14064291467065065,
    0.12255520671147846,
    0.12255520671147846,
    0.10094204410628717,
    0.10094204410628717,
    0.07642573025488905,
    0.07642573025488905,
    0.0497145488949698,
    0.0497145488949698,
    0.02161601352648331,
    0.02161601352648331
  ],
  [
    0.1610544498487837,
    0.15896884339395434,
    0.15896884339395434,
    0.15276604206585967,
    0.15276604206585967,
    0.1426067021736066,
    0.1426067021736066,
    0.12875396253933621,
    0.12875396253933621,
    0.11156664554733399,
    0.11156664554733399,
    0.09149002162245,
    0.09149002162245,
    0.06904454273764123,
    0.06904454273764123,
    0.0448142267656996,
    0.0448142267656996,
    0.019461788229726478,
    0.019461788229726478
  ],
  [
    0.15275338713072584,
    0.15275338713072584,
    0.14917298647260374,
    0.14917298647260374,
    0.14209610931838204,
    0.14209610931838204,
    0.13168863844917664,
    0.13168863844917664,
    0.11819453196151841,
    0.11819453196151841,
    0.10193011981724044,
    0.10193011981724044,
    0.08327674157670475,
    0.08327674157670475,
    0.06267204833410907,
    0.06267204833410907,
    0.04060142980038694,
    0.04060142980038694,
    0.017614007139152118,
    0.017614007139152118
  ],
  [
    0.14608113364969041,
    0.14452440398997005,
    0.14452440398997005,
    0.13988739479107315,
    0.13988739479107315,
    0.13226893863333747,
    0.13226893863333747,
    0.12183141605372853,
    0.12183141605372853,
    0.10879729916714838,
    0.10879729916714838,
    0.09344442345603386,
    0.09344442345603386,
    0.0761001136283793,
    0.0761001136283793,
    0.057134425426857205,
    0.057134425426857205,
    0.036953789770852494,
    0.036953789770852494,
    0.016017228257774335,
    0.016017228257774335
  ],
  [
    0.13925187285563198,
    0.13925187285563198,
    0.13654149834601517,
    0.13654149834601517,
    0.13117350478706238,
    0.13117350478706238,
    0.12325237681051242,
    0.12325237681051242,
    0.11293229608053922,
    0.11293229608053922,
    0.10041414444288096,
    0.10041414444288096,
    0.08594160621706773,
    0.08594160621706773,
    0.06979646842452049,
    0.06979646842452049,
    0.052293335152683286,
    0.052293335152683286,
    0.03377490158481415,
    0.03377490158481415,
    0.0146279952982722,
    0.0146279952982722
  ],
  [
    0.13365457218610619,
    0.1324620394046966,
    0.1324620394046966,
    0.12890572218808216,
    0.12890572218808216,
    0.12304908430672953,
    0.12304908430672953,
    0.11499664022241136,
    0.11499664022241136,
    0.10489209146454141,
    0.10489209146454141,
    0.09291576606003515,
    0.09291576606003515,
    0.07928141177671895,
    0.07928141177671895,
    0.06423242140852585,
    0.06423242140852585,
    0.04803767173108467,
    0.04803767173108467,
    0.030988005856979445,
    0.030988005856979445,
    0.013411859487141771,
    0.013411859487141771
  ],
  [
    0.12793819534675216,
    0.12793819534675216,
    0.1258374563468283,
    0.1258374563468283,
    0.12167047292780339,
    0.12167047292780339,
    0.1155056680537256,
    0.1155056680537256,
    0.10744427011596563,
    0.10744427011596563,
    0.09761865210411388,
    0.09761865210411388,
    0.08619016153195327,
    0.08619016153195327,
    0.0733464814110803,
    0.0733464814110803,
    0.05929858491543678,
    0.05929858491543678,
    0.04427743881741981,
    0.04427743881741981,
    0.028531388628933663,
    0.028531388628933663,
    0.0123412297999872,
    0.0123412297999872
  ]
];
var cubicPoint = (xs, ys, t) => {
  const x = (1 - t) * (1 - t) * (1 - t) * xs[0] + 3 * (1 - t) * (1 - t) * t * xs[1] + 3 * (1 - t) * t * t * xs[2] + t * t * t * xs[3];
  const y = (1 - t) * (1 - t) * (1 - t) * ys[0] + 3 * (1 - t) * (1 - t) * t * ys[1] + 3 * (1 - t) * t * t * ys[2] + t * t * t * ys[3];
  return { x, y };
};
var getCubicArcLength = ({
  sx,
  sy,
  t
}) => {
  const v0x = 3 * (sx[1] - sx[0]);
  const v1x = 3 * (sx[2] - sx[1]);
  const v2x = 3 * (sx[3] - sx[2]);
  const v0y = 3 * (sy[1] - sy[0]);
  const v1y = 3 * (sy[2] - sy[1]);
  const v2y = 3 * (sy[3] - sy[2]);
  let correctedT;
  const n = 20;
  const z = t / 2;
  let sum = 0;
  for (let i = 0;i < n; i++) {
    correctedT = z * tValues[n][i] + z;
    const mt = 1 - correctedT;
    const xbase = mt * mt * v0x + 2 * mt * correctedT * v1x + correctedT * correctedT * v2x;
    const ybase = mt * mt * v0y + 2 * mt * correctedT * v1y + correctedT * correctedT * v2y;
    sum += cValues[n][i] * Math.sqrt(xbase * xbase + ybase * ybase);
  }
  return z * sum;
};
var quadraticPoint = (xs, ys, t) => {
  const x = (1 - t) * (1 - t) * xs[0] + 2 * (1 - t) * t * xs[1] + t * t * xs[2];
  const y = (1 - t) * (1 - t) * ys[0] + 2 * (1 - t) * t * ys[1] + t * t * ys[2];
  return { x, y };
};
var cubicDerivative = (xs, ys, t) => {
  const v0x = 3 * (xs[1] - xs[0]);
  const v1x = 3 * (xs[2] - xs[1]);
  const v2x = 3 * (xs[3] - xs[2]);
  const v0y = 3 * (ys[1] - ys[0]);
  const v1y = 3 * (ys[2] - ys[1]);
  const v2y = 3 * (ys[3] - ys[2]);
  const mt = 1 - t;
  return {
    x: mt * mt * v0x + 2 * mt * t * v1x + t * t * v2x,
    y: mt * mt * v0y + 2 * mt * t * v1y + t * t * v2y
  };
};
var getQuadraticArcLength = (xs, ys, t) => {
  if (t === undefined) {
    t = 1;
  }
  const ax = xs[0] - 2 * xs[1] + xs[2];
  const ay = ys[0] - 2 * ys[1] + ys[2];
  const bx = 2 * xs[1] - 2 * xs[0];
  const by = 2 * ys[1] - 2 * ys[0];
  const A = 4 * (ax * ax + ay * ay);
  const B = 4 * (ax * bx + ay * by);
  const C = bx * bx + by * by;
  if (A === 0) {
    return t * Math.sqrt((xs[2] - xs[0]) ** 2 + (ys[2] - ys[0]) ** 2);
  }
  const b = B / (2 * A);
  const c = C / A;
  const u = t + b;
  const k = c - b * b;
  const uuk = u * u + k > 0 ? Math.sqrt(u * u + k) : 0;
  const bbk = b * b + k > 0 ? Math.sqrt(b * b + k) : 0;
  const term = b + Math.sqrt(b * b + k) === 0 ? 0 : k * Math.log(Math.abs((u + uuk) / (b + bbk)));
  return Math.sqrt(A) / 2 * (u * uuk - b * bbk + term);
};
var quadraticDerivative = (xs, ys, t) => {
  return {
    x: (1 - t) * 2 * (xs[1] - xs[0]) + t * 2 * (xs[2] - xs[1]),
    y: (1 - t) * 2 * (ys[1] - ys[0]) + t * 2 * (ys[2] - ys[1])
  };
};
var t2length = ({
  length,
  totalLength,
  func
}) => {
  let error = 1;
  let t = length / totalLength;
  let step = (length - func(t)) / totalLength;
  let numIterations = 0;
  while (error > 0.001) {
    const increasedTLength = func(t + step);
    const increasedTError = Math.abs(length - increasedTLength) / totalLength;
    if (increasedTError < error) {
      error = increasedTError;
      t += step;
    } else {
      const decreasedTLength = func(t - step);
      const decreasedTError = Math.abs(length - decreasedTLength) / totalLength;
      if (decreasedTError < error) {
        error = decreasedTError;
        t -= step;
      } else {
        step /= 2;
      }
    }
    numIterations++;
    if (numIterations > 500) {
      break;
    }
  }
  return t;
};
var makeQuadratic = ({
  startX,
  startY,
  cpx,
  cpy,
  x,
  y
}) => {
  const a = { x: startX, y: startY };
  const b = { x: cpx, y: cpy };
  const c = { x, y };
  const length = getQuadraticArcLength([a.x, b.x, c.x, 0], [a.y, b.y, c.y, 0], 1);
  const getTotalLength = () => {
    return length;
  };
  const getPointAtLength = (len) => {
    const xs = [a.x, b.x, c.x, 0];
    const xy = [a.y, b.y, c.y, 0];
    const t = t2length({
      length: len,
      totalLength: length,
      func: (i) => getQuadraticArcLength(xs, xy, i)
    });
    return quadraticPoint(xs, xy, t);
  };
  const getTangentAtLength = (len) => {
    const xs = [a.x, b.x, c.x, 0];
    const xy = [a.y, b.y, c.y, 0];
    const t = t2length({
      length: len,
      totalLength: length,
      func: (i) => getQuadraticArcLength(xs, xy, i)
    });
    const derivative = quadraticDerivative(xs, xy, t);
    const mdl = Math.sqrt(derivative.x * derivative.x + derivative.y * derivative.y);
    let tangent;
    if (mdl > 0) {
      tangent = { x: derivative.x / mdl, y: derivative.y / mdl };
    } else {
      tangent = { x: 0, y: 0 };
    }
    return tangent;
  };
  const getC = () => {
    return c;
  };
  return {
    getPointAtLength,
    getTangentAtLength,
    getTotalLength,
    getC,
    type: "quadratic-bezier",
    getD: () => ({ x: 0, y: 0 })
  };
};
var makeCubic = ({
  startX,
  startY,
  cp1x,
  cp1y,
  cp2x,
  cp2y,
  x,
  y
}) => {
  const a = { x: startX, y: startY };
  const b = { x: cp1x, y: cp1y };
  const c = { x: cp2x, y: cp2y };
  const d = { x, y };
  const length = getCubicArcLength({
    sx: [a.x, b.x, c.x, d.x],
    sy: [a.y, b.y, c.y, d.y],
    t: 1
  });
  const getTotalLength = () => {
    return length;
  };
  const getPointAtLength = (len) => {
    const sx = [a.x, b.x, c.x, d.x];
    const sy = [a.y, b.y, c.y, d.y];
    const t = t2length({
      length: len,
      totalLength: length,
      func: (i) => {
        return getCubicArcLength({ sx, sy, t: i });
      }
    });
    return cubicPoint(sx, sy, t);
  };
  const getTangentAtLength = (len) => {
    const xs = [a.x, b.x, c.x, d.x];
    const xy = [a.y, b.y, c.y, d.y];
    const t = t2length({
      length: len,
      totalLength: length,
      func: (i) => getCubicArcLength({ sx: xs, sy: xy, t: i })
    });
    const derivative = cubicDerivative(xs, xy, t);
    const mdl = Math.sqrt(derivative.x * derivative.x + derivative.y * derivative.y);
    let tangent;
    if (mdl > 0) {
      tangent = { x: derivative.x / mdl, y: derivative.y / mdl };
    } else {
      tangent = { x: 0, y: 0 };
    }
    return tangent;
  };
  const getC = () => {
    return c;
  };
  const getD = () => {
    return d;
  };
  return {
    getPointAtLength,
    getTangentAtLength,
    getTotalLength,
    getC,
    getD,
    type: "cubic-bezier"
  };
};
var makeLinearPosition = ({
  x0,
  x1,
  y0,
  y1
}) => {
  return {
    getTotalLength: () => {
      return Math.sqrt((x0 - x1) ** 2 + (y0 - y1) ** 2);
    },
    getPointAtLength: (pos) => {
      let fraction = pos / Math.sqrt((x0 - x1) ** 2 + (y0 - y1) ** 2);
      fraction = Number.isNaN(fraction) ? 1 : fraction;
      const newDeltaX = (x1 - x0) * fraction;
      const newDeltaY = (y1 - y0) * fraction;
      return { x: x0 + newDeltaX, y: y0 + newDeltaY };
    },
    getTangentAtLength: () => {
      const module = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
      return { x: (x1 - x0) / module, y: (y1 - y0) / module };
    },
    type: "linear"
  };
};
var length = {
  a: 7,
  A: 7,
  C: 6,
  c: 6,
  H: 1,
  h: 1,
  L: 2,
  l: 2,
  M: 2,
  m: 2,
  Q: 4,
  q: 4,
  S: 4,
  s: 4,
  T: 2,
  t: 2,
  V: 1,
  v: 1,
  Z: 0,
  z: 0
};
var chunkExact = (array, instruction) => {
  const chunks = [];
  const expectedSize = length[instruction];
  if (array.length % expectedSize !== 0) {
    throw new Error(`Expected number of arguments of SVG instruction "${instruction} ${array.join(" ")}" to be a multiple of ${expectedSize}`);
  }
  for (let i = 0;i < array.length; i += expectedSize) {
    chunks.push(array.slice(i, i + expectedSize));
  }
  return chunks;
};
var makeInstructions = (arr, instruction, cb) => {
  return chunkExact(arr, instruction).map((args) => {
    return cb(args);
  });
};
var segmentRegExp = /([astvzqmhlc])([^astvzqmhlc]*)/gi;
var numberRegExp = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;
var arcNumberRegExp = /[\s,]*([-+]?(?:[0-9]+\.?[0-9]*|\.[0-9]+)(?:e[-+]?\d+)?)/iy;
var arcFlagRegExp = /[\s,]*([01])/y;
var parseValues = (args, instructionType) => {
  let numbers;
  if (instructionType === "A" || instructionType === "a") {
    numbers = [];
    let match;
    let lastIndex = 0;
    do {
      const regExp = numbers.length % 7 === 3 || numbers.length % 7 === 4 ? arcFlagRegExp : arcNumberRegExp;
      regExp.lastIndex = lastIndex;
      match = regExp.exec(args);
      if (match) {
        numbers.push(match[1]);
        lastIndex = regExp.lastIndex;
      }
    } while (match);
    const rest = args.slice(lastIndex);
    if (!/^[\s,]*$/.test(rest)) {
      throw new Error(`Malformed path data: ${instructionType} has an invalid value at "${rest.trim()}"`);
    }
  } else {
    numbers = args.match(numberRegExp);
  }
  if (!numbers || numbers.length === 0) {
    if (instructionType === "Z" || instructionType === "z") {
      return [];
    }
    throw new Error(`Malformed path data: ${instructionType} was expected to have numbers afterwards`);
  }
  const expectedArguments = length[instructionType];
  if (numbers.length % expectedArguments !== 0) {
    throw new Error(`Malformed path data: ${instructionType} was expected to have a multiple of ${expectedArguments} numbers, but got "${instructionType} ${numbers.join(" ")} instead"`);
  }
  return numbers.map(Number);
};
var parsePath = (path) => {
  if (!path) {
    throw new Error("No path provided");
  }
  const segments = path.match(segmentRegExp);
  if (!segments) {
    throw new Error(`No path elements found in string ${path}`);
  }
  return segments.map((segmentString) => {
    const command = segmentString.charAt(0);
    const args = parseValues(segmentString.substring(1), command);
    if (command === "M" && args.length > 2) {
      const segmentsArray = [];
      segmentsArray.push({
        type: command,
        x: args[0],
        y: args[1]
      });
      segmentsArray.push(...makeInstructions(args.slice(2), "L", (numbers) => ({
        type: "L",
        x: numbers[0],
        y: numbers[1]
      })));
      return segmentsArray;
    }
    if (command === "m" && args.length > 2) {
      const segmentsArray = [];
      segmentsArray.push({
        type: command,
        dx: args[0],
        dy: args[1]
      });
      segmentsArray.push(...makeInstructions(args.slice(2), "l", (numbers) => ({
        type: "l",
        dx: numbers[0],
        dy: numbers[1]
      })));
      return segmentsArray;
    }
    if (command === "Z" || command === "z") {
      return [
        {
          type: "Z"
        }
      ];
    }
    if (command === "A") {
      return makeInstructions(args, command, (numbers) => ({
        type: command,
        rx: numbers[0],
        ry: numbers[1],
        xAxisRotation: numbers[2],
        largeArcFlag: numbers[3] === 1,
        sweepFlag: numbers[4] === 1,
        x: numbers[5],
        y: numbers[6]
      }));
    }
    if (command === "a") {
      return makeInstructions(args, command, (numbers) => ({
        type: command,
        rx: numbers[0],
        ry: numbers[1],
        xAxisRotation: numbers[2],
        largeArcFlag: numbers[3] === 1,
        sweepFlag: numbers[4] === 1,
        dx: numbers[5],
        dy: numbers[6]
      }));
    }
    if (command === "C") {
      return makeInstructions(args, command, (numbers) => ({
        type: command,
        cp1x: numbers[0],
        cp1y: numbers[1],
        cp2x: numbers[2],
        cp2y: numbers[3],
        x: numbers[4],
        y: numbers[5]
      }));
    }
    if (command === "c") {
      return makeInstructions(args, command, (numbers) => ({
        type: command,
        cp1dx: numbers[0],
        cp1dy: numbers[1],
        cp2dx: numbers[2],
        cp2dy: numbers[3],
        dx: numbers[4],
        dy: numbers[5]
      }));
    }
    if (command === "S") {
      return makeInstructions(args, command, (numbers) => ({
        type: command,
        cpx: numbers[0],
        cpy: numbers[1],
        x: numbers[2],
        y: numbers[3]
      }));
    }
    if (command === "s") {
      return makeInstructions(args, command, (numbers) => ({
        type: command,
        cpdx: numbers[0],
        cpdy: numbers[1],
        dx: numbers[2],
        dy: numbers[3]
      }));
    }
    if (command === "H") {
      return makeInstructions(args, command, (numbers) => ({
        type: command,
        x: numbers[0]
      }));
    }
    if (command === "h") {
      return makeInstructions(args, command, (numbers) => ({
        type: command,
        dx: numbers[0]
      }));
    }
    if (command === "V") {
      return makeInstructions(args, command, (numbers) => ({
        type: command,
        y: numbers[0]
      }));
    }
    if (command === "v") {
      return makeInstructions(args, command, (numbers) => ({
        type: command,
        dy: numbers[0]
      }));
    }
    if (command === "L") {
      return makeInstructions(args, command, (numbers) => ({
        type: command,
        x: numbers[0],
        y: numbers[1]
      }));
    }
    if (command === "M") {
      return makeInstructions(args, command, (numbers) => ({
        type: command,
        x: numbers[0],
        y: numbers[1]
      }));
    }
    if (command === "m") {
      return makeInstructions(args, command, (numbers) => ({
        type: command,
        dx: numbers[0],
        dy: numbers[1]
      }));
    }
    if (command === "l") {
      return makeInstructions(args, command, (numbers) => ({
        type: command,
        dx: numbers[0],
        dy: numbers[1]
      }));
    }
    if (command === "Q") {
      return makeInstructions(args, command, (numbers) => ({
        type: command,
        cpx: numbers[0],
        cpy: numbers[1],
        x: numbers[2],
        y: numbers[3]
      }));
    }
    if (command === "q") {
      return makeInstructions(args, command, (numbers) => ({
        type: command,
        cpdx: numbers[0],
        cpdy: numbers[1],
        dx: numbers[2],
        dy: numbers[3]
      }));
    }
    if (command === "T") {
      return makeInstructions(args, command, (numbers) => ({
        type: command,
        x: numbers[0],
        y: numbers[1]
      }));
    }
    if (command === "t") {
      return makeInstructions(args, command, (numbers) => ({
        type: command,
        dx: numbers[0],
        dy: numbers[1]
      }));
    }
    throw new Error(`Invalid path element ${segmentString}`);
  }, []).flat(1);
};
var TAU = Math.PI * 2;
var mod = (x, m) => {
  return (x % m + m) % m;
};
var toRadians = (angle) => {
  return angle * (Math.PI / 180);
};
var distance = (p0, p1) => {
  return Math.sqrt((p1.x - p0.x) ** 2 + (p1.y - p0.y) ** 2);
};
var clamp = (val, min, max) => {
  return Math.min(Math.max(val, min), max);
};
var angleBetween = (v0, v1) => {
  const p = v0.x * v1.x + v0.y * v1.y;
  const n = Math.sqrt((v0.x ** 2 + v0.y ** 2) * (v1.x ** 2 + v1.y ** 2));
  const sign = v0.x * v1.y - v0.y * v1.x < 0 ? -1 : 1;
  const angle = sign * Math.acos(Math.max(-1, Math.min(1, p / n)));
  return angle;
};
var pointOnEllipticalArc = ({
  p0,
  rx,
  ry,
  xAxisRotation,
  largeArcFlag,
  sweepFlag,
  p1,
  t
}) => {
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  xAxisRotation = mod(xAxisRotation, 360);
  const xAxisRotationRadians = toRadians(xAxisRotation);
  if (p0.x === p1.x && p0.y === p1.y) {
    return { x: p0.x, y: p0.y, ellipticalArcAngle: 0 };
  }
  if (rx === 0 || ry === 0) {
    return {
      x: p0.x + (p1.x - p0.x) * t,
      y: p0.y + (p1.y - p0.y) * t,
      ellipticalArcAngle: 0
    };
  }
  const dx = (p0.x - p1.x) / 2;
  const dy = (p0.y - p1.y) / 2;
  const transformedPoint = {
    x: Math.cos(xAxisRotationRadians) * dx + Math.sin(xAxisRotationRadians) * dy,
    y: -Math.sin(xAxisRotationRadians) * dx + Math.cos(xAxisRotationRadians) * dy
  };
  const radiiCheck = transformedPoint.x ** 2 / rx ** 2 + transformedPoint.y ** 2 / ry ** 2;
  if (radiiCheck > 1) {
    rx *= Math.sqrt(radiiCheck);
    ry *= Math.sqrt(radiiCheck);
  }
  const cSquareNumerator = rx ** 2 * ry ** 2 - rx ** 2 * transformedPoint.y ** 2 - ry ** 2 * transformedPoint.x ** 2;
  const cSquareRootDenom = rx ** 2 * transformedPoint.y ** 2 + ry ** 2 * transformedPoint.x ** 2;
  let cRadicand = cSquareNumerator / cSquareRootDenom;
  cRadicand = cRadicand < 0 ? 0 : cRadicand;
  const cCoef = (largeArcFlag === sweepFlag ? -1 : 1) * Math.sqrt(cRadicand);
  const transformedCenter = {
    x: cCoef * (rx * transformedPoint.y / ry),
    y: cCoef * (-(ry * transformedPoint.x) / rx)
  };
  const center = {
    x: Math.cos(xAxisRotationRadians) * transformedCenter.x - Math.sin(xAxisRotationRadians) * transformedCenter.y + (p0.x + p1.x) / 2,
    y: Math.sin(xAxisRotationRadians) * transformedCenter.x + Math.cos(xAxisRotationRadians) * transformedCenter.y + (p0.y + p1.y) / 2
  };
  const startVector = {
    x: (transformedPoint.x - transformedCenter.x) / rx,
    y: (transformedPoint.y - transformedCenter.y) / ry
  };
  const startAngle = angleBetween({
    x: 1,
    y: 0
  }, startVector);
  const endVector = {
    x: (-transformedPoint.x - transformedCenter.x) / rx,
    y: (-transformedPoint.y - transformedCenter.y) / ry
  };
  let sweepAngle = angleBetween(startVector, endVector);
  if (!sweepFlag && sweepAngle > 0) {
    sweepAngle -= 2 * Math.PI;
  } else if (sweepFlag && sweepAngle < 0) {
    sweepAngle += 2 * Math.PI;
  }
  sweepAngle %= 2 * Math.PI;
  const angle = startAngle + sweepAngle * t;
  const ellipseComponentX = rx * Math.cos(angle);
  const ellipseComponentY = ry * Math.sin(angle);
  const point = {
    x: Math.cos(xAxisRotationRadians) * ellipseComponentX - Math.sin(xAxisRotationRadians) * ellipseComponentY + center.x,
    y: Math.sin(xAxisRotationRadians) * ellipseComponentX + Math.cos(xAxisRotationRadians) * ellipseComponentY + center.y,
    ellipticalArcStartAngle: startAngle,
    ellipticalArcEndAngle: startAngle + sweepAngle,
    ellipticalArcAngle: angle,
    ellipticalArcCenter: center,
    resultantRx: rx,
    resultantRy: ry
  };
  return point;
};
var approximateArcLengthOfCurve = (resolution, pointOnCurveFunc) => {
  resolution = resolution ? resolution : 500;
  let resultantArcLength = 0;
  const arcLengthMap = [];
  const approximationLines = [];
  let prevPoint = pointOnCurveFunc(0);
  let nextPoint;
  for (let i = 0;i < resolution; i++) {
    const t = clamp(i * (1 / resolution), 0, 1);
    nextPoint = pointOnCurveFunc(t);
    resultantArcLength += distance(prevPoint, nextPoint);
    approximationLines.push([prevPoint, nextPoint]);
    arcLengthMap.push({
      t,
      arcLength: resultantArcLength
    });
    prevPoint = nextPoint;
  }
  nextPoint = pointOnCurveFunc(1);
  approximationLines.push([prevPoint, nextPoint]);
  resultantArcLength += distance(prevPoint, nextPoint);
  arcLengthMap.push({
    t: 1,
    arcLength: resultantArcLength
  });
  return {
    arcLength: resultantArcLength,
    arcLengthMap,
    approximationLines
  };
};
var makeArc = ({
  x0,
  y0,
  rx,
  ry,
  xAxisRotate,
  LargeArcFlag,
  SweepFlag,
  x1,
  y1
}) => {
  const lengthProperties = approximateArcLengthOfCurve(300, (t) => {
    return pointOnEllipticalArc({
      p0: { x: x0, y: y0 },
      rx,
      ry,
      xAxisRotation: xAxisRotate,
      largeArcFlag: LargeArcFlag,
      sweepFlag: SweepFlag,
      p1: { x: x1, y: y1 },
      t
    });
  });
  const length = lengthProperties.arcLength;
  const getPointAtLength = (fractionLength) => {
    if (fractionLength < 0) {
      fractionLength = 0;
    } else if (fractionLength > length) {
      fractionLength = length;
    }
    const position = pointOnEllipticalArc({
      p0: { x: x0, y: y0 },
      rx,
      ry,
      xAxisRotation: xAxisRotate,
      largeArcFlag: LargeArcFlag,
      sweepFlag: SweepFlag,
      p1: { x: x1, y: y1 },
      t: fractionLength / length
    });
    return { x: position.x, y: position.y };
  };
  return {
    getPointAtLength,
    getTangentAtLength: (fractionLength) => {
      if (fractionLength < 0) {
        fractionLength = 0;
      } else if (fractionLength > length) {
        fractionLength = length;
      }
      const point_dist = 0.05;
      const p1 = getPointAtLength(fractionLength);
      let p2;
      if (fractionLength < 0) {
        fractionLength = 0;
      } else if (fractionLength > length) {
        fractionLength = length;
      }
      if (fractionLength < length - point_dist) {
        p2 = getPointAtLength(fractionLength + point_dist);
      } else {
        p2 = getPointAtLength(fractionLength - point_dist);
      }
      const xDist = p2.x - p1.x;
      const yDist = p2.y - p1.y;
      const dist = Math.sqrt(xDist * xDist + yDist * yDist);
      const forward = fractionLength < length - point_dist ? 1 : -1;
      const sign = NoReactInternals.ENABLE_V5_BREAKING_CHANGES ? forward : -forward;
      return { x: sign * xDist / dist, y: sign * yDist / dist };
    },
    getTotalLength: () => {
      return length;
    },
    type: "arc"
  };
};
var constructFromInstructions = (instructions) => {
  let totalLength = 0;
  const partialLengths = [];
  const functions = [];
  let initialPoint = null;
  let cur = [0, 0];
  let prev_point = [0, 0];
  let curve;
  let ringStart = [0, 0];
  const segments = [];
  for (let i = 0;i < instructions.length; i++) {
    const instruction = instructions[i];
    if (instruction.type !== "m" && instruction.type !== "M" && segments.length > 0) {
      segments[segments.length - 1].push(instruction);
    }
    if (instruction.type === "M") {
      cur = [instruction.x, instruction.y];
      ringStart = [cur[0], cur[1]];
      segments.push([instruction]);
      functions.push(null);
      if (i === 0) {
        initialPoint = { x: instruction.x, y: instruction.y };
      }
    }
    if (instruction.type === "m") {
      cur = [instruction.dx + cur[0], instruction.dy + cur[1]];
      ringStart = [cur[0], cur[1]];
      segments.push([{ type: "M", x: cur[0], y: cur[1] }]);
      functions.push(null);
    }
    if (instruction.type === "L") {
      totalLength += Math.sqrt((cur[0] - instruction.x) ** 2 + (cur[1] - instruction.y) ** 2);
      functions.push(makeLinearPosition({
        x0: cur[0],
        x1: instruction.x,
        y0: cur[1],
        y1: instruction.y
      }));
      cur = [instruction.x, instruction.y];
    }
    if (instruction.type === "l") {
      totalLength += Math.sqrt(instruction.dx ** 2 + instruction.dy ** 2);
      functions.push(makeLinearPosition({
        x0: cur[0],
        x1: instruction.dx + cur[0],
        y0: cur[1],
        y1: instruction.dy + cur[1]
      }));
      cur = [instruction.dx + cur[0], instruction.dy + cur[1]];
    }
    if (instruction.type === "H") {
      totalLength += Math.abs(cur[0] - instruction.x);
      functions.push(makeLinearPosition({
        x0: cur[0],
        x1: instruction.x,
        y0: cur[1],
        y1: cur[1]
      }));
      cur[0] = instruction.x;
    }
    if (instruction.type === "h") {
      totalLength += Math.abs(instruction.dx);
      functions.push(makeLinearPosition({
        x0: cur[0],
        x1: cur[0] + instruction.dx,
        y0: cur[1],
        y1: cur[1]
      }));
      cur[0] = instruction.dx + cur[0];
    } else if (instruction.type === "V") {
      totalLength += Math.abs(cur[1] - instruction.y);
      functions.push(makeLinearPosition({
        x0: cur[0],
        x1: cur[0],
        y0: cur[1],
        y1: instruction.y
      }));
      cur[1] = instruction.y;
    }
    if (instruction.type === "v") {
      totalLength += Math.abs(instruction.dy);
      functions.push(makeLinearPosition({
        x0: cur[0],
        x1: cur[0],
        y0: cur[1],
        y1: cur[1] + instruction.dy
      }));
      cur[1] = instruction.dy + cur[1];
    } else if (instruction.type === "Z") {
      totalLength += Math.sqrt((ringStart[0] - cur[0]) ** 2 + (ringStart[1] - cur[1]) ** 2);
      functions.push(makeLinearPosition({
        x0: cur[0],
        x1: ringStart[0],
        y0: cur[1],
        y1: ringStart[1]
      }));
      cur = [ringStart[0], ringStart[1]];
    }
    if (instruction.type === "C") {
      curve = makeCubic({
        startX: cur[0],
        startY: cur[1],
        cp1x: instruction.cp1x,
        cp1y: instruction.cp1y,
        cp2x: instruction.cp2x,
        cp2y: instruction.cp2y,
        x: instruction.x,
        y: instruction.y
      });
      totalLength += curve.getTotalLength();
      cur = [instruction.x, instruction.y];
      functions.push(curve);
    } else if (instruction.type === "c") {
      curve = makeCubic({
        startX: cur[0],
        startY: cur[1],
        cp1x: cur[0] + instruction.cp1dx,
        cp1y: cur[1] + instruction.cp1dy,
        cp2x: cur[0] + instruction.cp2dx,
        cp2y: cur[1] + instruction.cp2dy,
        x: cur[0] + instruction.dx,
        y: cur[1] + instruction.dy
      });
      if (curve.getTotalLength() > 0) {
        totalLength += curve.getTotalLength();
        functions.push(curve);
        cur = [instruction.dx + cur[0], instruction.dy + cur[1]];
      } else {
        functions.push(makeLinearPosition({ x0: cur[0], x1: cur[0], y0: cur[1], y1: cur[1] }));
      }
    }
    if (instruction.type === "S") {
      const prev = instructions[i - 1];
      const prevWasCurve = prev.type === "C" || prev.type === "c" || prev.type === "S" || prev.type === "s";
      if (i > 0 && prevWasCurve) {
        if (curve) {
          const c = curve.getC();
          curve = makeCubic({
            startX: cur[0],
            startY: cur[1],
            cp1x: 2 * cur[0] - c.x,
            cp1y: 2 * cur[1] - c.y,
            cp2x: instruction.cpx,
            cp2y: instruction.cpy,
            x: instruction.x,
            y: instruction.y
          });
        }
      } else {
        curve = makeCubic({
          startX: cur[0],
          startY: cur[1],
          cp1x: cur[0],
          cp1y: cur[1],
          cp2x: instruction.cpx,
          cp2y: instruction.cpy,
          x: instruction.x,
          y: instruction.y
        });
      }
      if (curve) {
        totalLength += curve.getTotalLength();
        cur = [instruction.x, instruction.y];
        functions.push(curve);
      }
    }
    if (instruction.type === "s") {
      const prev = instructions[i - 1];
      const prevWasCurve = prev.type === "C" || prev.type === "c" || prev.type === "S" || prev.type === "s";
      if (i > 0 && prevWasCurve) {
        if (curve) {
          const c = curve.getC();
          const d = curve.getD();
          curve = makeCubic({
            startX: cur[0],
            startY: cur[1],
            cp1x: cur[0] + d.x - c.x,
            cp1y: cur[1] + d.y - c.y,
            cp2x: cur[0] + instruction.cpdx,
            cp2y: cur[1] + instruction.cpdy,
            x: cur[0] + instruction.dx,
            y: cur[1] + instruction.dy
          });
        }
      } else {
        curve = makeCubic({
          startX: cur[0],
          startY: cur[1],
          cp1x: cur[0],
          cp1y: cur[1],
          cp2x: cur[0] + instruction.cpdx,
          cp2y: cur[1] + instruction.cpdy,
          x: cur[0] + instruction.dx,
          y: cur[1] + instruction.dy
        });
      }
      if (curve) {
        totalLength += curve.getTotalLength();
        cur = [instruction.dx + cur[0], instruction.dy + cur[1]];
        functions.push(curve);
      }
    }
    if (instruction.type === "Q") {
      if (cur[0] === instruction.cpx && cur[1] === instruction.cpy) {
        const linearCurve = makeLinearPosition({
          x0: instruction.cpx,
          x1: instruction.x,
          y0: instruction.cpy,
          y1: instruction.y
        });
        totalLength += linearCurve.getTotalLength();
        functions.push(linearCurve);
      } else {
        curve = makeQuadratic({
          startX: cur[0],
          startY: cur[1],
          cpx: instruction.cpx,
          cpy: instruction.cpy,
          x: instruction.x,
          y: instruction.y
        });
        totalLength += curve.getTotalLength();
        functions.push(curve);
      }
      cur = [instruction.x, instruction.y];
      prev_point = [instruction.cpx, instruction.cpy];
    }
    if (instruction.type === "q") {
      if (instruction.cpdx === 0 && instruction.cpdy === 0) {
        const linearCurve = makeLinearPosition({
          x0: cur[0],
          x1: cur[0] + instruction.dx,
          y0: cur[1],
          y1: cur[1] + instruction.dy
        });
        totalLength += linearCurve.getTotalLength();
        functions.push(linearCurve);
      } else {
        curve = makeQuadratic({
          startX: cur[0],
          startY: cur[1],
          cpx: cur[0] + instruction.cpdx,
          cpy: cur[1] + instruction.cpdy,
          x: cur[0] + instruction.dx,
          y: cur[1] + instruction.dy
        });
        totalLength += curve.getTotalLength();
        functions.push(curve);
      }
      prev_point = [cur[0] + instruction.cpdx, cur[1] + instruction.cpdy];
      cur = [instruction.dx + cur[0], instruction.dy + cur[1]];
    }
    if (instruction.type === "T") {
      const prev = instructions[i - 1];
      const prevWasQ = prev.type === "Q" || prev.type === "q" || prev.type === "T" || prev.type === "t";
      if (i > 0 && prevWasQ) {
        curve = makeQuadratic({
          startX: cur[0],
          startY: cur[1],
          cpx: 2 * cur[0] - prev_point[0],
          cpy: 2 * cur[1] - prev_point[1],
          x: instruction.x,
          y: instruction.y
        });
        functions.push(curve);
        totalLength += curve.getTotalLength();
      } else {
        const linearCurve = makeLinearPosition({
          x0: cur[0],
          x1: instruction.x,
          y0: cur[1],
          y1: instruction.y
        });
        functions.push(linearCurve);
        totalLength += linearCurve.getTotalLength();
      }
      prev_point = prevWasQ ? [2 * cur[0] - prev_point[0], 2 * cur[1] - prev_point[1]] : [cur[0], cur[1]];
      cur = [instruction.x, instruction.y];
    }
    if (instruction.type === "t") {
      const prev = instructions[i - 1];
      const prevWasQ = prev.type === "Q" || prev.type === "q" || prev.type === "T" || prev.type === "t";
      if (i > 0 && prevWasQ) {
        curve = makeQuadratic({
          startX: cur[0],
          startY: cur[1],
          cpx: 2 * cur[0] - prev_point[0],
          cpy: 2 * cur[1] - prev_point[1],
          x: cur[0] + instruction.dx,
          y: cur[1] + instruction.dy
        });
        totalLength += curve.getTotalLength();
        functions.push(curve);
      } else {
        const linearCurve = makeLinearPosition({
          x0: cur[0],
          x1: cur[0] + instruction.dx,
          y0: cur[1],
          y1: cur[1] + instruction.dy
        });
        totalLength += linearCurve.getTotalLength();
        functions.push(linearCurve);
      }
      prev_point = prevWasQ ? [2 * cur[0] - prev_point[0], 2 * cur[1] - prev_point[1]] : [cur[0], cur[1]];
      cur = [instruction.dx + cur[0], instruction.dy + cur[1]];
    }
    if (instruction.type === "A") {
      const arcCurve = makeArc({
        x0: cur[0],
        y0: cur[1],
        rx: instruction.rx,
        ry: instruction.ry,
        xAxisRotate: instruction.xAxisRotation,
        LargeArcFlag: instruction.largeArcFlag,
        SweepFlag: instruction.sweepFlag,
        x1: instruction.x,
        y1: instruction.y
      });
      totalLength += arcCurve.getTotalLength();
      cur = [instruction.x, instruction.y];
      functions.push(arcCurve);
    }
    if (instruction.type === "a") {
      const arcCurve = makeArc({
        x0: cur[0],
        y0: cur[1],
        rx: instruction.rx,
        ry: instruction.ry,
        xAxisRotate: instruction.xAxisRotation,
        LargeArcFlag: instruction.largeArcFlag,
        SweepFlag: instruction.sweepFlag,
        x1: cur[0] + instruction.dx,
        y1: cur[1] + instruction.dy
      });
      totalLength += arcCurve.getTotalLength();
      cur = [cur[0] + instruction.dx, cur[1] + instruction.dy];
      functions.push(arcCurve);
    }
    partialLengths.push(totalLength);
  }
  return {
    segments,
    initialPoint,
    totalLength,
    partialLengths,
    functions
  };
};
var construct = (string) => {
  const parsed = parsePath(string);
  return constructFromInstructions(parsed);
};
var getLength = (path) => {
  const constructucted = construct(path);
  return constructucted.totalLength;
};
var evolvePath = (progress, path) => {
  const length = getLength(path);
  if (progress === 0) {
    const extendedLength = length * 1.5;
    return {
      strokeDasharray: `${extendedLength} ${extendedLength}`,
      strokeDashoffset: extendedLength
    };
  }
  const strokeDasharray = `${length} ${length}`;
  const strokeDashoffset = length - progress * length;
  return { strokeDasharray, strokeDashoffset };
};

// ../../node_modules/.bun/roughjs@4.6.6/node_modules/roughjs/bin/math.js
class Random {
  constructor(seed) {
    this.seed = seed;
  }
  next() {
    if (this.seed) {
      return (2 ** 31 - 1 & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31;
    } else {
      return Math.random();
    }
  }
}
// ../../node_modules/.bun/roughjs@4.6.6/node_modules/roughjs/bin/renderer.js
function line(x1, y1, x2, y2, o) {
  return { type: "path", ops: _doubleLine(x1, y1, x2, y2, o) };
}
function linearPath(points, close, o) {
  const len = (points || []).length;
  if (len > 2) {
    const ops = [];
    for (let i = 0;i < len - 1; i++) {
      ops.push(..._doubleLine(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], o));
    }
    if (close) {
      ops.push(..._doubleLine(points[len - 1][0], points[len - 1][1], points[0][0], points[0][1], o));
    }
    return { type: "path", ops };
  } else if (len === 2) {
    return line(points[0][0], points[0][1], points[1][0], points[1][1], o);
  }
  return { type: "path", ops: [] };
}
function polygon(points, o) {
  return linearPath(points, true, o);
}
function rectangle(x, y, width, height, o) {
  const points = [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height]
  ];
  return polygon(points, o);
}
function ellipse(x, y, width, height, o) {
  const params = generateEllipseParams(width, height, o);
  return ellipseWithParams(x, y, o, params).opset;
}
function generateEllipseParams(width, height, o) {
  const psq = Math.sqrt(Math.PI * 2 * Math.sqrt((Math.pow(width / 2, 2) + Math.pow(height / 2, 2)) / 2));
  const stepCount = Math.ceil(Math.max(o.curveStepCount, o.curveStepCount / Math.sqrt(200) * psq));
  const increment = Math.PI * 2 / stepCount;
  let rx = Math.abs(width / 2);
  let ry = Math.abs(height / 2);
  const curveFitRandomness = 1 - o.curveFitting;
  rx += _offsetOpt(rx * curveFitRandomness, o);
  ry += _offsetOpt(ry * curveFitRandomness, o);
  return { increment, rx, ry };
}
function ellipseWithParams(x, y, o, ellipseParams) {
  const [ap1, cp1] = _computeEllipsePoints(ellipseParams.increment, x, y, ellipseParams.rx, ellipseParams.ry, 1, ellipseParams.increment * _offset(0.1, _offset(0.4, 1, o), o), o);
  let o1 = _curve(ap1, null, o);
  if (!o.disableMultiStroke && o.roughness !== 0) {
    const [ap2] = _computeEllipsePoints(ellipseParams.increment, x, y, ellipseParams.rx, ellipseParams.ry, 1.5, 0, o);
    const o2 = _curve(ap2, null, o);
    o1 = o1.concat(o2);
  }
  return {
    estimatedPoints: cp1,
    opset: { type: "path", ops: o1 }
  };
}
function random(ops) {
  if (!ops.randomizer) {
    ops.randomizer = new Random(ops.seed || 0);
  }
  return ops.randomizer.next();
}
function _offset(min, max, ops, roughnessGain = 1) {
  return ops.roughness * roughnessGain * (random(ops) * (max - min) + min);
}
function _offsetOpt(x, ops, roughnessGain = 1) {
  return _offset(-x, x, ops, roughnessGain);
}
function _doubleLine(x1, y1, x2, y2, o, filling = false) {
  const singleStroke = filling ? o.disableMultiStrokeFill : o.disableMultiStroke;
  const o1 = _line(x1, y1, x2, y2, o, true, false);
  if (singleStroke) {
    return o1;
  }
  const o2 = _line(x1, y1, x2, y2, o, true, true);
  return o1.concat(o2);
}
function _line(x1, y1, x2, y2, o, move, overlay) {
  const lengthSq = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
  const length = Math.sqrt(lengthSq);
  let roughnessGain = 1;
  if (length < 200) {
    roughnessGain = 1;
  } else if (length > 500) {
    roughnessGain = 0.4;
  } else {
    roughnessGain = -0.0016668 * length + 1.233334;
  }
  let offset = o.maxRandomnessOffset || 0;
  if (offset * offset * 100 > lengthSq) {
    offset = length / 10;
  }
  const halfOffset = offset / 2;
  const divergePoint = 0.2 + random(o) * 0.2;
  let midDispX = o.bowing * o.maxRandomnessOffset * (y2 - y1) / 200;
  let midDispY = o.bowing * o.maxRandomnessOffset * (x1 - x2) / 200;
  midDispX = _offsetOpt(midDispX, o, roughnessGain);
  midDispY = _offsetOpt(midDispY, o, roughnessGain);
  const ops = [];
  const randomHalf = () => _offsetOpt(halfOffset, o, roughnessGain);
  const randomFull = () => _offsetOpt(offset, o, roughnessGain);
  const preserveVertices = o.preserveVertices;
  if (move) {
    if (overlay) {
      ops.push({
        op: "move",
        data: [
          x1 + (preserveVertices ? 0 : randomHalf()),
          y1 + (preserveVertices ? 0 : randomHalf())
        ]
      });
    } else {
      ops.push({
        op: "move",
        data: [
          x1 + (preserveVertices ? 0 : _offsetOpt(offset, o, roughnessGain)),
          y1 + (preserveVertices ? 0 : _offsetOpt(offset, o, roughnessGain))
        ]
      });
    }
  }
  if (overlay) {
    ops.push({
      op: "bcurveTo",
      data: [
        midDispX + x1 + (x2 - x1) * divergePoint + randomHalf(),
        midDispY + y1 + (y2 - y1) * divergePoint + randomHalf(),
        midDispX + x1 + 2 * (x2 - x1) * divergePoint + randomHalf(),
        midDispY + y1 + 2 * (y2 - y1) * divergePoint + randomHalf(),
        x2 + (preserveVertices ? 0 : randomHalf()),
        y2 + (preserveVertices ? 0 : randomHalf())
      ]
    });
  } else {
    ops.push({
      op: "bcurveTo",
      data: [
        midDispX + x1 + (x2 - x1) * divergePoint + randomFull(),
        midDispY + y1 + (y2 - y1) * divergePoint + randomFull(),
        midDispX + x1 + 2 * (x2 - x1) * divergePoint + randomFull(),
        midDispY + y1 + 2 * (y2 - y1) * divergePoint + randomFull(),
        x2 + (preserveVertices ? 0 : randomFull()),
        y2 + (preserveVertices ? 0 : randomFull())
      ]
    });
  }
  return ops;
}
function _curve(points, closePoint, o) {
  const len = points.length;
  const ops = [];
  if (len > 3) {
    const b = [];
    const s = 1 - o.curveTightness;
    ops.push({ op: "move", data: [points[1][0], points[1][1]] });
    for (let i = 1;i + 2 < len; i++) {
      const cachedVertArray = points[i];
      b[0] = [cachedVertArray[0], cachedVertArray[1]];
      b[1] = [cachedVertArray[0] + (s * points[i + 1][0] - s * points[i - 1][0]) / 6, cachedVertArray[1] + (s * points[i + 1][1] - s * points[i - 1][1]) / 6];
      b[2] = [points[i + 1][0] + (s * points[i][0] - s * points[i + 2][0]) / 6, points[i + 1][1] + (s * points[i][1] - s * points[i + 2][1]) / 6];
      b[3] = [points[i + 1][0], points[i + 1][1]];
      ops.push({ op: "bcurveTo", data: [b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]] });
    }
    if (closePoint && closePoint.length === 2) {
      const ro = o.maxRandomnessOffset;
      ops.push({ op: "lineTo", data: [closePoint[0] + _offsetOpt(ro, o), closePoint[1] + _offsetOpt(ro, o)] });
    }
  } else if (len === 3) {
    ops.push({ op: "move", data: [points[1][0], points[1][1]] });
    ops.push({
      op: "bcurveTo",
      data: [
        points[1][0],
        points[1][1],
        points[2][0],
        points[2][1],
        points[2][0],
        points[2][1]
      ]
    });
  } else if (len === 2) {
    ops.push(..._line(points[0][0], points[0][1], points[1][0], points[1][1], o, true, true));
  }
  return ops;
}
function _computeEllipsePoints(increment, cx, cy, rx, ry, offset, overlap, o) {
  const coreOnly = o.roughness === 0;
  const corePoints = [];
  const allPoints = [];
  if (coreOnly) {
    increment = increment / 4;
    allPoints.push([
      cx + rx * Math.cos(-increment),
      cy + ry * Math.sin(-increment)
    ]);
    for (let angle = 0;angle <= Math.PI * 2; angle = angle + increment) {
      const p = [
        cx + rx * Math.cos(angle),
        cy + ry * Math.sin(angle)
      ];
      corePoints.push(p);
      allPoints.push(p);
    }
    allPoints.push([
      cx + rx * Math.cos(0),
      cy + ry * Math.sin(0)
    ]);
    allPoints.push([
      cx + rx * Math.cos(increment),
      cy + ry * Math.sin(increment)
    ]);
  } else {
    const radOffset = _offsetOpt(0.5, o) - Math.PI / 2;
    allPoints.push([
      _offsetOpt(offset, o) + cx + 0.9 * rx * Math.cos(radOffset - increment),
      _offsetOpt(offset, o) + cy + 0.9 * ry * Math.sin(radOffset - increment)
    ]);
    const endAngle = Math.PI * 2 + radOffset - 0.01;
    for (let angle = radOffset;angle < endAngle; angle = angle + increment) {
      const p = [
        _offsetOpt(offset, o) + cx + rx * Math.cos(angle),
        _offsetOpt(offset, o) + cy + ry * Math.sin(angle)
      ];
      corePoints.push(p);
      allPoints.push(p);
    }
    allPoints.push([
      _offsetOpt(offset, o) + cx + rx * Math.cos(radOffset + Math.PI * 2 + overlap * 0.5),
      _offsetOpt(offset, o) + cy + ry * Math.sin(radOffset + Math.PI * 2 + overlap * 0.5)
    ]);
    allPoints.push([
      _offsetOpt(offset, o) + cx + 0.98 * rx * Math.cos(radOffset + overlap),
      _offsetOpt(offset, o) + cy + 0.98 * ry * Math.sin(radOffset + overlap)
    ]);
    allPoints.push([
      _offsetOpt(offset, o) + cx + 0.9 * rx * Math.cos(radOffset + overlap * 0.5),
      _offsetOpt(offset, o) + cy + 0.9 * ry * Math.sin(radOffset + overlap * 0.5)
    ]);
  }
  return [allPoints, corePoints];
}

// src/render-annotation.tsx
import { jsx } from "react/jsx-runtime";
var opsToPath = (opList) => {
  const paths = [];
  for (const drawing of opList) {
    let path = "";
    for (const item of drawing.ops) {
      const { data } = item;
      if (item.op === "move") {
        if (path.trim()) {
          paths.push(path.trim());
        }
        path = `M${data[0]} ${data[1]} `;
      } else if (item.op === "bcurveTo") {
        path += `C${data[0]} ${data[1]}, ${data[2]} ${data[3]}, ${data[4]} ${data[5]} `;
      } else if (item.op === "lineTo") {
        path += `L${data[0]} ${data[1]} `;
      }
    }
    if (path.trim()) {
      paths.push(path.trim());
    }
  }
  return paths;
};
var addKeysToPaths = (paths) => {
  const occurrences = new Map;
  return paths.map((d) => {
    const occurrence = occurrences.get(d) ?? 0;
    occurrences.set(d, occurrence + 1);
    return { d, key: `${d}-${occurrence}` };
  });
};
var getOptions = (type, seed, overrides) => {
  return {
    maxRandomnessOffset: 5,
    roughness: type === "highlight" ? 3 : 1.5,
    bowing: 1,
    stroke: "#000",
    strokeWidth: 1.5,
    curveTightness: 0,
    curveFitting: 0.95,
    curveStepCount: 9,
    fillStyle: "hachure",
    fillWeight: -1,
    hachureAngle: -41,
    hachureGap: -1,
    dashOffset: -1,
    dashGap: -1,
    zigzagOffset: -1,
    disableMultiStroke: type !== "double",
    disableMultiStrokeFill: false,
    fillShapeRoughnessGain: 1.5,
    preserveVertices: false,
    ...overrides,
    seed
  };
};
var getCircleItems = (rect, config) => {
  if (config.type !== "circle") {
    throw new Error("Not a circle");
  }
  if (config.box === "inside") {
    const paddedWidth = rect.w + (config.padding.left + config.padding.right);
    const paddedHeight = rect.h + (config.padding.top + config.padding.bottom);
    const x = rect.x - config.padding.left + paddedWidth / 2;
    const y = rect.y - config.padding.top + paddedHeight / 2;
    return { width: paddedWidth, height: paddedHeight, x, y };
  }
  const cx = rect.x + rect.w / 2 - config.padding.left / 2 + config.padding.right / 2;
  const cy = rect.y + rect.h / 2 - config.padding.top / 2 + config.padding.bottom / 2;
  const width = rect.w + config.padding.left + config.padding.right;
  const height = rect.h + config.padding.top + config.padding.bottom;
  return {
    width: width / Math.sqrt(2) * 2,
    height: height / Math.sqrt(2) * 2,
    x: cx,
    y: cy
  };
};
function getInstructions({
  rect,
  config,
  seed,
  options
}) {
  if (config.type === "none") {
    return { opList: [], strokeWidth: 0 };
  }
  if (config.type === "underline") {
    const o = getOptions("single", seed, options);
    const { iterations } = config;
    const rtl = config.rtl ? 1 : 0;
    const opList = [];
    const y = rect.y + rect.h + config.padding.top;
    for (let i = rtl;i < iterations + rtl; i++) {
      if (i % 2) {
        opList.push(line(rect.x + rect.w, y, rect.x, y, o));
      } else {
        opList.push(line(rect.x, y, rect.x + rect.w, y, o));
      }
    }
    return { opList, strokeWidth: config.strokeWidth };
  }
  if (config.type === "strike-through") {
    const o = getOptions("single", seed, options);
    const { iterations } = config;
    const rtl = config.rtl ? 1 : 0;
    const opList = [];
    const y = rect.y + rect.h / 2;
    for (let i = rtl;i < iterations + rtl; i++) {
      if (i % 2) {
        opList.push(line(rect.x + rect.w, y, rect.x, y, o));
      } else {
        opList.push(line(rect.x, y, rect.x + rect.w, y, o));
      }
    }
    return { opList, strokeWidth: config.strokeWidth };
  }
  if (config.type === "box") {
    const o = getOptions("single", seed, options);
    const { iterations } = config;
    const opList = [];
    const x = rect.x - config.padding.left;
    const y = rect.y - config.padding.top;
    const width = rect.w + (config.padding.left + config.padding.right);
    const height = rect.h + (config.padding.top + config.padding.bottom);
    for (let i = 0;i < iterations; i++) {
      opList.push(rectangle(x, y, width, height, o));
    }
    return { opList, strokeWidth: config.strokeWidth };
  }
  if (config.type === "bracket") {
    const o = getOptions("single", seed, options);
    const opList = [];
    const lx = rect.x - config.padding.left;
    const rx = rect.x + rect.w + config.padding.right;
    const ty = rect.y - config.padding.top;
    const by = rect.y + rect.h + config.padding.bottom;
    const sides = [
      {
        enabled: config.bracketBottom,
        points: [
          [lx, by],
          [rx, by]
        ]
      },
      {
        enabled: config.bracketTop,
        points: [
          [lx, ty],
          [rx, ty]
        ]
      },
      {
        enabled: config.bracketLeft,
        points: [
          [lx, ty],
          [lx, by]
        ]
      },
      {
        enabled: config.bracketRight,
        points: [
          [rx, ty],
          [rx, by]
        ]
      }
    ];
    for (const side of sides) {
      if (side.enabled) {
        opList.push(linearPath(side.points, false, o));
      }
    }
    return { opList, strokeWidth: config.strokeWidth };
  }
  if (config.type === "crossed-off") {
    const o = getOptions("single", seed, options);
    const { iterations } = config;
    const rtl = config.rtl ? 1 : 0;
    const opList = [];
    const { x } = rect;
    const { y } = rect;
    const x2 = x + rect.w;
    const y2 = y + rect.h;
    for (let i = rtl;i < iterations + rtl; i++) {
      if (i % 2) {
        opList.push(line(x2, y2, x, y, o));
      } else {
        opList.push(line(x, y, x2, y2, o));
      }
    }
    for (let i = rtl;i < iterations + rtl; i++) {
      if (i % 2) {
        opList.push(line(x, y2, x2, y, o));
      } else {
        opList.push(line(x2, y, x, y2, o));
      }
    }
    return { opList, strokeWidth: config.strokeWidth };
  }
  if (config.type === "circle") {
    const { iterations } = config;
    const opList = [];
    const { width, height, x, y } = getCircleItems(rect, config);
    for (let i = 0;i < iterations; i++) {
      const o = getOptions("single", seed + i, options);
      opList.push(ellipse(x, y, width, height, o));
    }
    return { opList, strokeWidth: config.strokeWidth };
  }
  if (config.type === "highlight") {
    const { iterations } = config;
    const rtl = config.rtl ? 1 : 0;
    const opList = [];
    const y = rect.y + rect.h / 2 + (config.padding.bottom - config.padding.top) / 2;
    for (let i = rtl;i < iterations + rtl; i++) {
      const o = getOptions("highlight", seed + i, options);
      if (i % 2) {
        opList.push(line(rect.x + rect.w + config.padding.right, y, rect.x - config.padding.left, y, o));
      } else {
        opList.push(line(rect.x - config.padding.left, y, rect.x + rect.w + config.padding.right, y, o));
      }
    }
    return {
      opList,
      strokeWidth: rect.h + config.padding.top + config.padding.bottom
    };
  }
  throw new Error(`Unrecognized annotation type: ${config}`);
}
var renderAnnotation = ({
  rect,
  config,
  seed,
  progress,
  options
}) => {
  if (config.type === "none") {
    return [];
  }
  const { opList, strokeWidth } = getInstructions({
    config,
    rect,
    seed,
    options
  });
  const pathsWithKeys = addKeysToPaths(opsToPath(opList));
  return pathsWithKeys.map(({ d, key }, i) => {
    const isLast = i === pathsWithKeys.length - 1;
    const progressForIteration = Math.max(0, Math.min(isLast ? Infinity : 1, progress * pathsWithKeys.length - i));
    const { strokeDasharray, strokeDashoffset } = evolvePath(progressForIteration, d);
    return /* @__PURE__ */ jsx("path", {
      d,
      fill: "none",
      stroke: config.color,
      strokeWidth,
      strokeDasharray,
      strokeDashoffset
    }, key);
  });
};

// src/rough.ts
var getLocalRect = (element) => {
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    w: element.offsetWidth,
    h: element.offsetHeight
  };
};
var render = ({
  seed,
  element,
  config,
  progress,
  options
}) => {
  const rect = getLocalRect(element);
  if (rect.w === 0 || rect.h === 0) {
    return [];
  }
  return renderAnnotation({
    config,
    seed,
    rect,
    progress,
    options
  });
};

// src/types.ts
var defaultPadding = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0
};
var resolvePadding = (padding) => {
  return {
    ...defaultPadding,
    ...padding
  };
};
var resolveIterations = (iterations, defaultIterations) => {
  if (iterations === undefined) {
    return defaultIterations;
  }
  if (!Number.isInteger(iterations) || iterations < 1) {
    throw new TypeError("iterations must be an integer of at least 1");
  }
  return iterations;
};
var shared = ({
  color,
  strokeWidth,
  defaultStrokeWidth
}) => {
  return {
    color: color ?? "currentColor",
    strokeWidth: strokeWidth ?? defaultStrokeWidth
  };
};
var resolveRoughOptions = (options) => {
  return Object.fromEntries(Object.entries(options).filter(([, value]) => value !== undefined));
};
var resolveAnnotationConfig = (config) => {
  if (config.type === "none") {
    return config;
  }
  if (config.type === "underline") {
    return {
      type: "underline",
      ...shared({ ...config, defaultStrokeWidth: 20 }),
      padding: resolvePadding(config.padding),
      iterations: resolveIterations(config.iterations, 2),
      rtl: config.rtl ?? false
    };
  }
  if (config.type === "strike-through") {
    return {
      type: "strike-through",
      ...shared({ ...config, defaultStrokeWidth: 20 }),
      iterations: resolveIterations(config.iterations, 1),
      rtl: config.rtl ?? false
    };
  }
  if (config.type === "box") {
    return {
      type: "box",
      ...shared({ ...config, defaultStrokeWidth: 7 }),
      padding: resolvePadding(config.padding),
      iterations: resolveIterations(config.iterations, 2)
    };
  }
  if (config.type === "bracket") {
    return {
      type: "bracket",
      ...shared({ ...config, defaultStrokeWidth: 20 }),
      padding: resolvePadding(config.padding),
      bracketLeft: config.bracketLeft ?? false,
      bracketRight: config.bracketRight ?? true,
      bracketTop: config.bracketTop ?? false,
      bracketBottom: config.bracketBottom ?? false
    };
  }
  if (config.type === "crossed-off") {
    return {
      type: "crossed-off",
      ...shared({ ...config, defaultStrokeWidth: 20 }),
      iterations: resolveIterations(config.iterations, 1),
      rtl: config.rtl ?? false
    };
  }
  if (config.type === "circle") {
    return {
      type: "circle",
      ...shared({ ...config, defaultStrokeWidth: 20 }),
      padding: resolvePadding(config.padding),
      iterations: resolveIterations(config.iterations, 2),
      box: config.box ?? "around"
    };
  }
  if (config.type === "highlight") {
    return {
      type: "highlight",
      color: config.color ?? "currentColor",
      padding: resolvePadding(config.padding),
      iterations: resolveIterations(config.iterations, 2),
      rtl: config.rtl ?? false
    };
  }
  const invalidConfig = config;
  throw new TypeError(`Unsupported annotation type: ${String(invalidConfig.type)}`);
};

// src/create-annotation.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var createAnnotation = () => {
  const ref = createRef();
  const svgRef = createRef();
  const Container = (props) => {
    return props.children;
  };
  const Tracker = ({ children, style }) => {
    return /* @__PURE__ */ jsx2("span", {
      ref,
      style: {
        ...style,
        display: "inline-block",
        position: "relative",
        whiteSpace: "pre"
      },
      children
    });
  };
  const Annotation = ({
    roughness,
    maxRandomnessOffset,
    bowing,
    curveFitting,
    curveTightness,
    curveStepCount,
    disableMultiStroke,
    preserveVertices,
    seed,
    progress,
    ...config
  }) => {
    const frame = useCurrentFrame();
    const parsedKey = JSON.stringify(resolveAnnotationConfig(config));
    const parsed = useMemo2(() => {
      return JSON.parse(parsedKey);
    }, [parsedKey]);
    const roughJsOptions = useMemo2(() => {
      return resolveRoughOptions({
        roughness,
        maxRandomnessOffset,
        bowing,
        curveFitting,
        curveTightness,
        curveStepCount,
        disableMultiStroke,
        preserveVertices
      });
    }, [
      bowing,
      curveFitting,
      curveStepCount,
      curveTightness,
      disableMultiStroke,
      maxRandomnessOffset,
      preserveVertices,
      roughness
    ]);
    const { delayRender, continueRender } = useDelayRender();
    const size = useElementSize(ref);
    const isWaitingForSize = size === null;
    useLayoutEffect(() => {
      if (!isWaitingForSize) {
        return;
      }
      const handle = delayRender("Waiting for rough annotation size");
      return () => continueRender(handle);
    }, [continueRender, delayRender, isWaitingForSize]);
    const [svgChildren, setSvgChildren] = useState2([]);
    useLayoutEffect(() => {
      if (!ref.current || !svgRef.current) {
        setSvgChildren([]);
        return;
      }
      setSvgChildren(render({
        config: parsed,
        element: ref.current,
        seed: seed ?? 1,
        progress,
        options: roughJsOptions
      }));
    }, [frame, parsed, progress, roughJsOptions, seed, size]);
    return /* @__PURE__ */ jsx2("svg", {
      ref: svgRef,
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        overflow: "visible",
        width: 100,
        height: 100
      },
      children: svgChildren
    });
  };
  return { Container, Tracker, Annotation };
};

// src/Annotation.tsx
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
var colorSchema = {
  color: {
    type: "color",
    default: "currentColor",
    description: "Color"
  }
};
var strokeWidthSchema = (defaultValue) => ({
  strokeWidth: {
    type: "number",
    min: 0,
    step: 1,
    default: defaultValue,
    description: "Stroke Width",
    hiddenFromList: false
  }
});
var iterationsSchema = (defaultValue) => ({
  iterations: {
    type: "number",
    min: 1,
    step: 1,
    integer: true,
    default: defaultValue,
    description: "Iterations",
    hiddenFromList: false
  }
});
var rtlSchema = {
  rtl: {
    type: "boolean",
    default: false,
    description: "Right-to-left"
  }
};
var roughJsControlsSchema = (defaultRoughness) => ({
  roughness: {
    type: "number",
    min: 0,
    step: 0.1,
    default: defaultRoughness,
    description: "Roughness",
    hiddenFromList: false
  },
  maxRandomnessOffset: {
    type: "number",
    min: 0,
    step: 0.1,
    default: 5,
    description: "Max Randomness Offset",
    hiddenFromList: false
  },
  bowing: {
    type: "number",
    min: 0,
    step: 0.1,
    default: 1,
    description: "Bowing",
    hiddenFromList: false
  },
  disableMultiStroke: {
    type: "boolean",
    default: false,
    description: "Disable Multi Stroke"
  },
  preserveVertices: {
    type: "boolean",
    default: false,
    description: "Preserve Vertices"
  }
});
var curveControlsSchema = {
  curveFitting: {
    type: "number",
    min: 0,
    step: 0.01,
    default: 0.95,
    description: "Curve Fitting",
    hiddenFromList: false
  },
  curveTightness: {
    type: "number",
    step: 0.1,
    default: 0,
    description: "Curve Tightness",
    hiddenFromList: false
  },
  curveStepCount: {
    type: "number",
    min: 1,
    step: 1,
    integer: true,
    default: 9,
    description: "Curve Step Count",
    hiddenFromList: false
  }
};
var paddingSchema = {
  "padding.left": {
    type: "number",
    step: 1,
    default: 0,
    description: "Left Padding",
    hiddenFromList: false
  },
  "padding.right": {
    type: "number",
    step: 1,
    default: 0,
    description: "Right Padding",
    hiddenFromList: false
  },
  "padding.top": {
    type: "number",
    step: 1,
    default: 0,
    description: "Top Padding",
    hiddenFromList: false
  },
  "padding.bottom": {
    type: "number",
    step: 1,
    default: 0,
    description: "Bottom Padding",
    hiddenFromList: false
  }
};
var underlinePaddingSchema = {
  "padding.top": paddingSchema["padding.top"]
};
var sharedSchema = (defaultRoughness) => ({
  ...Interactive.baseSchema,
  progress: {
    type: "number",
    min: 0,
    max: 1,
    step: 0.01,
    default: 1,
    description: "Progress",
    hiddenFromList: false
  },
  disabled: {
    type: "boolean",
    default: false,
    description: "Disabled"
  },
  seed: {
    type: "number",
    step: 1,
    default: 1,
    description: "Seed",
    hiddenFromList: false
  },
  ...roughJsControlsSchema(defaultRoughness),
  ...colorSchema,
  ...Interactive.textSchema,
  ...Interactive.childrenSchema,
  ...Interactive.backgroundSchema,
  ...Interactive.borderSchema,
  ...Interactive.borderRadiusSchema
});
var highlightSchema = {
  ...sharedSchema(3),
  ...iterationsSchema(2),
  ...rtlSchema,
  ...paddingSchema
};
var underlineSchema = {
  ...sharedSchema(1.5),
  ...strokeWidthSchema(20),
  ...iterationsSchema(2),
  ...rtlSchema,
  ...underlinePaddingSchema
};
var strikeThroughSchema = {
  ...sharedSchema(1.5),
  ...strokeWidthSchema(20),
  ...iterationsSchema(1),
  ...rtlSchema
};
var crossedOffSchema = {
  ...sharedSchema(1.5),
  ...strokeWidthSchema(20),
  ...iterationsSchema(1),
  ...rtlSchema
};
var boxSchema = {
  ...sharedSchema(1.5),
  ...strokeWidthSchema(7),
  ...iterationsSchema(2),
  ...paddingSchema
};
var bracketSchema = {
  ...sharedSchema(1.5),
  ...strokeWidthSchema(20),
  ...paddingSchema,
  bracketLeft: {
    type: "boolean",
    default: false,
    description: "Left Bracket"
  },
  bracketRight: {
    type: "boolean",
    default: true,
    description: "Right Bracket"
  },
  bracketTop: {
    type: "boolean",
    default: false,
    description: "Top Bracket"
  },
  bracketBottom: {
    type: "boolean",
    default: false,
    description: "Bottom Bracket"
  }
};
var circleSchema = {
  ...sharedSchema(1.5),
  ...strokeWidthSchema(20),
  ...iterationsSchema(2),
  ...paddingSchema,
  ...curveControlsSchema,
  box: {
    type: "enum",
    default: "around",
    description: "Box",
    keyframable: false,
    variants: {
      inside: {},
      around: {}
    }
  }
};
var makeAnnotationComponent = ({
  type,
  componentName,
  documentationSlug,
  layer,
  schema
}) => {
  const AnnotationInner = ({
    children,
    durationInFrames,
    from,
    premountFor,
    postmountFor,
    styleWhilePremounted,
    styleWhilePostmounted,
    trimBefore,
    playbackRate,
    loop,
    freeze,
    hidden,
    name,
    showInTimeline,
    controls,
    style,
    progress,
    seed,
    disabled,
    roughness,
    maxRandomnessOffset,
    bowing,
    curveFitting,
    curveTightness,
    curveStepCount,
    disableMultiStroke,
    preserveVertices,
    ...configProps
  }) => {
    const videoEnabled = Internals.useVideoEnabled();
    const annotation = useMemo3(() => {
      return createAnnotation();
    }, []);
    const config = disabled ? { type: "none" } : { ...configProps, type };
    const annotationElement = videoEnabled ? /* @__PURE__ */ jsx3(annotation.Annotation, {
      ...config,
      progress,
      seed,
      roughness,
      maxRandomnessOffset,
      bowing,
      curveFitting,
      curveTightness,
      curveStepCount,
      disableMultiStroke,
      preserveVertices
    }) : null;
    const {
      effectivePremountFor,
      effectivePostmountFor,
      freezeFrame,
      isPremountingOrPostmounting,
      premountingActive,
      postmountingActive,
      premountingStyle
    } = Internals.usePremounting({
      from: from ?? 0,
      durationInFrames: Internals.resolveSequenceDuration({
        durationInFrames,
        playbackRate,
        loop
      }),
      premountFor: premountFor ?? null,
      postmountFor: postmountFor ?? null,
      style: null,
      styleWhilePremounted: styleWhilePremounted ?? null,
      styleWhilePostmounted: styleWhilePostmounted ?? null,
      hideWhilePremounted: "opacity"
    });
    return /* @__PURE__ */ jsx3(Freeze, {
      frame: freezeFrame,
      active: isPremountingOrPostmounting,
      children: /* @__PURE__ */ jsx3(Sequence, {
        layout: "none",
        from: from ?? 0,
        trimBefore,
        playbackRate,
        loop,
        durationInFrames: durationInFrames ?? Infinity,
        freeze,
        hidden,
        name: name ?? `<${componentName}>`,
        showInTimeline: showInTimeline ?? true,
        controls,
        _remotionInternalDocumentationLink: `https://www.remotion.dev/docs/rough-notation/${documentationSlug}`,
        _remotionInternalPremountDisplay: effectivePremountFor || null,
        _remotionInternalPostmountDisplay: effectivePostmountFor || null,
        _remotionInternalIsPremounting: premountingActive,
        _remotionInternalIsPostmounting: postmountingActive,
        children: /* @__PURE__ */ jsx3("span", {
          style: {
            display: "inline-block",
            position: "relative",
            ...premountingStyle
          },
          children: /* @__PURE__ */ jsxs(annotation.Container, {
            children: [
              layer === "behind" ? annotationElement : null,
              /* @__PURE__ */ jsx3(annotation.Tracker, {
                style,
                children
              }),
              layer === "on-top" ? annotationElement : null
            ]
          })
        })
      })
    });
  };
  const Component = Interactive.withSchema({
    Component: AnnotationInner,
    componentName: `<${componentName}>`,
    componentIdentity: Interactive._internalMakeRemotionComponentIdentity({
      packageName: "@remotion/rough-notation",
      componentName
    }),
    schema,
    supportsEffects: false
  });
  Component.displayName = componentName;
  return Component;
};
var Highlight = makeAnnotationComponent({
  type: "highlight",
  componentName: "Highlight",
  documentationSlug: "highlight",
  layer: "behind",
  schema: highlightSchema
});
var Underline = makeAnnotationComponent({
  type: "underline",
  componentName: "Underline",
  documentationSlug: "underline",
  layer: "on-top",
  schema: underlineSchema
});
var StrikeThrough = makeAnnotationComponent({
  type: "strike-through",
  componentName: "StrikeThrough",
  documentationSlug: "strike-through",
  layer: "on-top",
  schema: strikeThroughSchema
});
var CrossedOff = makeAnnotationComponent({
  type: "crossed-off",
  componentName: "CrossedOff",
  documentationSlug: "crossed-off",
  layer: "on-top",
  schema: crossedOffSchema
});
var Box = makeAnnotationComponent({
  type: "box",
  componentName: "Box",
  documentationSlug: "box",
  layer: "on-top",
  schema: boxSchema
});
var Bracket = makeAnnotationComponent({
  type: "bracket",
  componentName: "Bracket",
  documentationSlug: "bracket",
  layer: "on-top",
  schema: bracketSchema
});
var Circle = makeAnnotationComponent({
  type: "circle",
  componentName: "Circle",
  documentationSlug: "circle",
  layer: "on-top",
  schema: circleSchema
});
export {
  Box,
  Bracket,
  Circle,
  CrossedOff,
  Highlight,
  StrikeThrough,
  Underline
};

export { getInstructions, renderAnnotation };
