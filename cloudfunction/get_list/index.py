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


def getTestList(connection, category):
    try:
        connection.ping(reconnect=True)
        cursor = connection.cursor()
        if category == "fire":
            search_stmt = (
                "SELECT * FROM `test` ORDER BY -times Limit 0,100"
            )
            data = ()
        else:
            search_stmt = (
                "SELECT * FROM `test` WHERE category=(SELECT cid FROM `category` WHERE remark=%s) ORDER BY -tid"
            )
            data = (category)
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
                "icon": icon,
                "type": False if eve_test["description"] else True,
                "desc": eve_test["description"] if len(eve_test["description"]) > 40 else eve_test["description"][0:40] + "..."
            }
            test_list.append(test)

        return test_list

    except Exception as e:
        print("getTestList", e)
        return []

def main_handler(event, context):
    print(event)

    body = json.loads(event['body'])
    category = body['category']

    return {
        "result": getTestList(connection, category)
    }

