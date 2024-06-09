import FormSignIn from "../components/formSignIn/FormSignIn";
export default function SignIn({socket}) {
  return (
    <>
      <FormSignIn socket={socket}/>
    </>
  );
}
