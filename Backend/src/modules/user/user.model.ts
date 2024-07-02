// post.model.ts
import {Table, Column, Model, ForeignKey, BelongsTo, HasMany} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import Post from "../feed/post.model";


@Table({
    tableName: 'user',
    timestamps: false,
})
class User extends Model<User> {

    // id
    @Column({
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    public id!: number;

    // email
    @Column({
        type: DataTypes.STRING,
        allowNull: false,
    })
    public email!: string;

    // password
    @Column({
        type: DataTypes.STRING,
        allowNull: false,
    })
    public password!: string;

    // name
    @Column({
        type: DataTypes.STRING,
        allowNull: false,
    })
    public name!: string;

    // status
    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue : 'I\'m New!'
    })
    public status!: string

    // @HasMany(() => Post)
    // posts!: Post[];
}

export default User;
