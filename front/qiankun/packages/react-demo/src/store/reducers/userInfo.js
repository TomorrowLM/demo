export default function (info={name:'',age:''}, action) {
  switch (action.type) {
    case "userInfo":
      return action.info;
    default:
      return info;
  }
}
