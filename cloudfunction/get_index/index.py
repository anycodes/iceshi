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


def getTestList(connection):
    try:
        connection.ping(reconnect=True)
        cursor = connection.cursor()
        search_stmt = (
            "SELECT * FROM `test` WHERE remark=0"
        )
        data = ()
        cursor.execute(search_stmt, data)
        cursor.close()
        test_list = []
        total = 5
        for eve_test in cursor.fetchall():
            icon = 'page'
            if eve_test["times"] > 50:
                icon = 'fire'
            else:
                if total > 0:
                    icon = 'new'
                    total = total - 1

            test = {
                "tid": eve_test["tid"],
                "title": eve_test["name"],
                "src": eve_test["pic"],
            }
            test_list.append(test)

        return test_list

    except Exception as e:
        print("getTestList", e)
        return []

def main_handler(event, context):
    print(event)
    return {
        "result": getTestList(connection)
    }

