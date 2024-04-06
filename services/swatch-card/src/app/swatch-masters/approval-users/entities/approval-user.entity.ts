import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, VersionColumn } from "typeorm";

@Entity('swatch_approval_users')
export class ApprovalUserEntity {
    @PrimaryGeneratedColumn("increment",{
        name:'approved_id'
      })
      approvedId:number;
    
      @Column("varchar",{
        name:"user_id"
        })
        userId:string;
    
      @Column("varchar",{
        name:"email_id"
        })
        emailId:string;
    
      @Column('varchar', {
            name: 'user_signature',
        })
        signImageName: string;
      
        @Column('varchar', {
          name: 'sign_path',
      })
       signPath: string;
    
      @Column("boolean",{
        name:"is_active"
        })
      isActive:boolean;
    
      @CreateDateColumn({
        name: "created_at",
        type:"datetime"
      })
      createdAt: Date;
    
      @Column("varchar", {
          name: "created_user"
      })
      createdUser: string ;
      
      @VersionColumn({
          default:1,
          name: "version_flag"
      })
      versionFlag: number;
}
