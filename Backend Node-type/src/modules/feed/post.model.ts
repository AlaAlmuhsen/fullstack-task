// post.model.ts
import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import User from "../user/user.model";


@Table({
    tableName: 'post',
    timestamps: true,
})
class Post extends Model<Post> {

    // id
    @Column({
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    public id!: number;

    // title
    @Column({
        type: DataTypes.STRING,
        allowNull: false,
    })
    public title!: string;

    // imageUrl
    @Column({
        type: DataTypes.STRING,
        allowNull: false,
    })
    public imageUrl!: string;

    // content
    @Column({
        type: DataTypes.STRING,
        allowNull: false,
    })
    public content!: string;

    // creator
    @Column({
        type: DataTypes.JSON,
        allowNull: false,
    })
    public creator!: String;

    @ForeignKey(() => User)
    @Column({
        type: 'INTEGER',
        allowNull: false,
    })
    public userId!: number;

    @BelongsTo(() => User)
    public user!: User;

}

export default Post;
