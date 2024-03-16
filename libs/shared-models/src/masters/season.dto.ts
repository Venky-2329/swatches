export class SeasonDto {
  seasonId: number;
  seasonName: string;
  createdUser: string;
  updatedUser: string;
  constructor(
    seasonId: number,
    seasonName: string,
    createdUser: string,
    updatedUser: string
  ) {
    this.seasonId = seasonId;
    this.seasonName = seasonName;
    this.createdUser = createdUser;
    this.updatedUser = updatedUser;
  }
}
