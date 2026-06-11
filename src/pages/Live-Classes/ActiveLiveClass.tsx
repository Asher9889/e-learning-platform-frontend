// import { useEffect, useState } from 'react';
// import { ConnectionState, ParticipantName, ParticipantTile, RoomContext, TrackLoop, useTracks } from '@livekit/components-react';
// import { Room, Track } from 'livekit-client';
// import { useLocation } from 'react-router-dom';
// import { useJoinLiveClass } from './hooks/useLiveClass';
// import { RoomContent } from '#components/live-classes/index';

// const ActiveLiveClass = () => {
//   const [room] = useState(() => new Room());
//   const joinLiveClassMutation = useJoinLiveClass()
//   const cameraTracks = useTracks([Track.Source.Camera]);


//   const { pathname } = useLocation();
//   const roomName = pathname.split("/").slice(-2)[0];


//   useEffect(() => {
//     joinLiveClassMutation.mutate(roomName, {
//       onSuccess: (data) => {
//         console.log("Join Live Class Success:", data);
//         room.connect(data.liveKit.serverURL, data.liveKit.token)
//           .then(() => {
//             console.log("Connected to Live Class Room");
//           })
//           .catch((error) => {
//             console.error("Failed to connect to Live Class Room:", error);
//           });
//       },
//       onError: (error) => {
//         console.error("Failed to join live class:", error);
//       },
//     });
//   }, [roomName])

//   return (
//     <RoomContext.Provider value={room}>
//      <RoomContent />
//       {/* Your components go here */}
//     </RoomContext.Provider>
//   );
// };

// export default ActiveLiveClass;