### select

```
[
	RowDataPacket {
		id: 30,
		username: 'xxxx',
		password: 'yyyy',
		email: 'ddd@exsample.com',
		created_at: 2020-01-24T07:39:19.000Z,
		updated_at: 2020-01-24T07:39:19.000Z,
	},
	...
]
```

### insert

```
OkPacket {
	fieldCount: 0,
	affectedRows: 1,
	insertId: 42,
	serverStatus: 3,
	warningCount: 0,
	message: '',
	protocol41: true,
	changedRows: 0
}
```

### delete

```
OkPacket {
	fieldCount: 0,
	affectedRows: 1,
	insertId: 0,
	serverStatus: 3,
	warningCount: 0,
	message: '',
	protocol41: true,
	changedRows: 0
}
```

### update

```
OkPacket {
	fieldCount: 0,
	affectedRows: 1,
	insertId: 0,
	serverStatus: 3,
	warningCount: 0,
	message: '(Rows matched: 1  Changed: 1  Warnings: 0',
	protocol41: true,
	changedRows: 1
}
```
