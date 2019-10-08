# -*- coding: utf8 -*-

import pymysql
import json

connection = pymysql.connect(host="mysql-host",
                             user="root",
                             password="mysql-password",
                             port=int(62580),
                             db="iceshi",
                             charset='utf8',
                             cursorclass=pymysql.cursors.DictCursor,
                             autocommit=1)


def getRandom(connection):
    try:
        connection.ping(reconnect=True)
        cursor = connection.cursor()
        search_stmt = (
            "select * from test order by rand() LIMIT 1"
        )
        data = ()
        cursor.execute(search_stmt, data)
        cursor.close()
        return {"tid": cursor.fetchall()[0]["tid"]}

    except Exception as e:
        print("getRandom", e)
        return {"tid": 0}


def main_handler(event, context):
    print(event)
    return {
        "result": getRandom(connection)
    }
