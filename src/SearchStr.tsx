import { LatLng } from "leaflet";
import React from "react";
import { BehaviorSubject, filter, interval, tap, throttle } from "rxjs";
export interface SearchStrProps {
  coordChange: (coordinate: LatLng) => void;
}

export function SearchStr({}: SearchStrProps) {
  let inputText = new BehaviorSubject<string>("");
  let throttledInputString = inputText.pipe(
    throttle((x) => interval(3000)),
    filter((x) => x?.length !== 0),
    tap((x) => {
      //HTTP GET
    })
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("form submited");
  };

  return (
    <form className="input-group mb-3" onSubmit={handleSubmit}>
      <input
        className="form-control"
        type="text"
        name="searchText"
        aria-describedby="searchButton"
        placeholder="Что ищем?"
        onChange={(a) => {
          inputText.next(a.target.value);
          console.log("input onChange", a);
        }}
      ></input>
      <button
        className="btn btn-outline-secondary"
        id="searchButton"
        type="submit"
      >
        Искать
      </button>
    </form>
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
