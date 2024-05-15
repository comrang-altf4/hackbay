import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type SelectionContextType = {
  regions: string[];
  setRegions: Dispatch<SetStateAction<string[]>>;
  season: number[];
  setSeason: Dispatch<SetStateAction<number[]>>;
  period: number;
  setPeriod: Dispatch<SetStateAction<number>>;
  ageGroup: number[];
  setAgeGroup: Dispatch<SetStateAction<number[]>>;
};

const SelectionContext = createContext<SelectionContextType>({
  regions: [],
  setRegions: () => {},
  season: [],
  setSeason: () => {},
  period: 1,
  setPeriod: () => {},
  ageGroup: [],
  setAgeGroup: () => {},
});

export default function SelectionProvider(props: { children: ReactNode }) {
  const [regions, setRegions] = useState([] as string[]);
  const [season, setSeason] = useState([1, 12]);
  const [period, setPeriod] = useState(1);
  const [ageGroup, setAgeGroup] = useState([0, 100]);
  return (
    <SelectionContext.Provider
      value={{
        regions,
        setRegions,
        season,
        setSeason,
        period,
        setPeriod,
        ageGroup,
        setAgeGroup,
      }}
    >
      {props.children}
    </SelectionContext.Provider>
  );
}

export function useSelectionContext() {
  return useContext(SelectionContext);
}
