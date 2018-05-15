import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToOne
} from "typeorm";
import { Org } from './Org';
import { Coach } from './Coach';
import { Client } from './Client';
import { Content } from './Content';

@Entity('file')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(type => Content, content => content.file)
  content: Content;

  @ManyToOne(type => Org, org => org.files)
  @JoinColumn({ name: 'org_id' })
  org: Org;
}
