import { LatLng } from "leaflet";
import React, { useEffect, useState } from "react";
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  from,
  mergeMap,
  Observable,
} from "rxjs";

export interface GeoData {
  name: string;
  latlng: LatLng;
}

export interface SearchStrProps {
  coordChange: (coordinate: LatLng) => void;
}

const getAddressByString = async (str: string) => {
  console.log("http GET for", str);
  const result = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${str}&format=json&countrycodes=ru`
  ).then((res) => res.json());
  console.log(result);
  return (result as any[]).map(
    (item) =>
      ({
        name: item.display_name,
        latlng: new LatLng(item.lat, item.lon),
      } as GeoData)
  );
};

// кастомный хук для observable
const useObservable = (observable: Observable<any>, setter: any) => {
  useEffect(() => {
    let subscription = observable.subscribe((result) => setter(result));
    return () => subscription.unsubscribe();
  }, [observable, setter]);
};

let inputText$ = new BehaviorSubject<string>("");
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log("form submited");
};

let searchResult$ = inputText$.pipe(
  filter((x) => x?.length > 2), // строка длиннее 2х символов
  debounceTime(750), // отсчет от последнего ввода символа
  distinctUntilChanged(), // пускает только если отличается от предыдущего
  mergeMap((x) => {
    return from(getAddressByString(x));
  })
);

export function SearchStr(props: SearchStrProps) {
  let [text, setText] = useState<string>("");
  let [items, setItems] = useState<GeoData[]>([]);
  useObservable(searchResult$, setItems);
  const handleSearchChange = (e: any) => {
    const newValue = e.target.value;
    setText(newValue);
    inputText$.next(newValue);
  };
  return (
    <div className="px-0">
      <form className="input-group" onSubmit={handleSubmit}>
        <input
          className="form-control"
          type="text"
          name="searchText"
          aria-describedby="searchButton"
          placeholder="Что ищем?"
          onChange={handleSearchChange}
          value={text}
        ></input>
        {/* <button
          className="btn btn-outline-secondary"
          id="searchButton"
          type="submit"
        >
          Искать
        </button> */}
      </form>
      <ul className="list-group">
        {items.map((item) => (
          <li
            className="list-group-item"
            key={item.latlng.lat.toString() + item.latlng.lng.toString()}
            onClick={() => {
              console.log("objectSelected", item);
              props.coordChange(item.latlng);
            }}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
// export class SearchStr extends React.Component<SerachStrProps> {
//   private inputText = new BehaviorSubject<string>("");
//   private throttledInputString = this.inputText.pipe(
//       throttle(x => interval(3000)),
//       filter(x => x?.length !== 0),
//       tap(x => {
//           // GET запрос
//       }));
//   handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     console.log("handling submit");
//     //тут будет запрос и эмит нового значения наружу в случае успеха
//   }

//   render() {
//     return (
//       <form className="input-group mb-3" onSubmit={this.handleSubmit}>
//         <input
//           className="form-control"
//           type="text"
//           name="searchText"
//           aria-describedby="searchButton"
//           placeholder="Что ищем?"
//           onChange={(a) => {
//             this.inputText.next(a.target.value);
//             console.log("input onChange", a);
//           }}
//         ></input>
//         <button
//           className="btn btn-outline-secondary"
//           id="searchButton"
//           type="submit"
//         >
//           Искать
//         </button>
//       </form>
//     );
//   }
// }
