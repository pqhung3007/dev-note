import Image from "next/image";

interface UserProps {
  username: string;
  displayName: string;
  photoURL: string;
}

export default function UserProfile({
  username,
  displayName,
  photoURL,
}: UserProps) {
  return (
    <div className="">
      <Image
        src={photoURL}
        alt="avatar"
        loader={() => photoURL}
        className="h-20 w-20 rounded-full object-cover"
        width={48}
        height={48}
        referrerPolicy="no-referrer"
      />
      <p>{username}</p>
      <h1>{displayName}</h1>
    </div>
  );
}
