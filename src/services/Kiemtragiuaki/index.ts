export interface RoomManager {
    id: string;
    name: string;
    numberOfSeat: string;
    roomType: number;
    personInChanrge: string;
}

const roomManagers: RoomManager[] = [];