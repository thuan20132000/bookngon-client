import { Spinner } from "../ui/spinner"



export const FullScreenSpinner = () => {
  return (
    <div className="inset-0 z-50 flex items-center justify-center bg-opacity-80 absolute top-0 left-0 h-full w-full bg-white/40">
      <Spinner
        className="text- size-8"
      />
    </div>
  )
}