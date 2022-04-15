(function($){
  $(function(){

//↑定型構文start
//============================================================

    // =======【1】デフォルトの動作をキャンセル ==========
    $(document).on("dragover drop dragenter",function(e){
      e.preventDefault();
    })
    $(document).on("drop",function(e){
      e.preventDefault();
    })

    // =======【2】ドロップファンクション処理 ==========
    $(".importBox").on("drop",function(e){

      //【2-0】split,UniCodeのステータス取得
      let UniCode = $("#UniCode").val();
      let SplitKey = ($("#SplitKey").val()==="カンマ") ? "," : "\t";

      //【2-1】事前処理
      e.preventDefault();
      let $data_area = $(".data-open-area");  //読み込み先を変数へ
      let files = e.originalEvent.dataTransfer.files[0];  //読み込みファイルを変数へ
      let reader = new FileReader();  //ファイルリーダーを変数へ

      //【2-2】ファイル名をドロップポイントへ表示
      $(this).text(files.name);
      $(this).addClass("import_done");

      //【2-3】ファイル読み込み
      reader.readAsText(files,UniCode);

      //【2-4】読み込み完了後の処理 =======
      reader.onload = function(event){
        //テーブルを作成して表示
        let insert = table_create(event.target.result,SplitKey);
        $data_area.html(insert);
        //リセットボタンを表示
        $(".reset-btn").css("display","block");

        //ヘッダーの表示・非表示処理
        let Row_val = $("#Row-Num").val();
        let $headerRow = $("th.RowTh");
        header_change($headerRow,Row_val);

        let Col_val = $("#Col-Num").val();
        let $headerCol = $("th.ColTh");
        header_change($headerCol,Col_val);

        rowcol_header_change(Row_val,Col_val);

      };
    }); //【2】の終わり


    //=======【3】カラム番号が更新された時=======
    $("#Row-Num").change(function(){
      let Row_val = $("#Row-Num").val();
      let Col_val = $("#Col-Num").val();
      let $header = $("th.RowTh");
      header_change($header,Row_val);
      rowcol_header_change(Row_val,Col_val);
    });

    $("#Col-Num").change(function(){
      let Row_val = $("#Row-Num").val();
      let Col_val = $("#Col-Num").val();
      let $header = $("th.ColTh");
      header_change($header,Col_val);
      rowcol_header_change(Row_val,Col_val);
    });


    //=======【4】検索された時=======
    $("#search-field button").on("click",function(){
      let STR = $("#search-field input").val();
      let $Row = $("div.data-open-area tr"); //テーブルレコード
      let $countNum = $("div.data-open-area p.countbox > span"); //件数
      $Row.show(); //全てを表示
      $Row.children().css("background-color",""); //背景色もクリア
      $countNum.text($Row.length-1);
      if(STR){
        let counter = 0;
        $Row.each(function(){
          let FLG = false;
          $(this).children().each(function(){
            if($(this).text().indexOf(STR) !== -1){
              $(this).css("background-color","red");
              counter += 1;
              FLG = true;
            }
          });
          if(FLG===false) $(this).hide();
        });
        $countNum.text(counter);
      }
    });


    //=======【4】検索された時=======
    $(".reset-btn button").on("click",function(){
      window.location.href="";
    });


//=================こっから↓はFunction==============================

    //=======【Function】ヘッダー変更処理
    function header_change($header,value){
      switch(value){
        case "なし":
          $header.hide();
          break;
        case "0から":
          $header.show();
          thNumChange($header,0);
          break;
        case "1から":
          $header.show();
          thNumChange($header,1);
          break;
      }
    }

    //ヘッダのカラム番号変更処理（↑で使っている）
    function thNumChange($header,num){
      $header.each(function(i){
        $(this).text(i+num);
      });
    }

    //=======【Function】テーブル一番左上の行列ヘッダー重なるとこ
    function rowcol_header_change(row_value,col_value){
      if(row_value === "なし" | col_value === "なし"){
        $("th.RowCol").hide();
      }else{
        $("th.RowCol").show();
      }
    }


    //=======【Function】ファイルの中身を渡すとテーブルにして返却=======
    function table_create(result,SplitKey){
      //受け取ったデータの最終改行コードをトリム
      let lineArr = $.trim(result).split(/\r?\n/g);
      //行列の二次元配列にする
      let itemArr = [];
      for(let i = 0;i <lineArr.length;i++){
        itemArr[i] = lineArr[i].split(SplitKey);
      }

      //件数表示
      let insert = "<p class='countbox'>レコード数： <span>" + lineArr.length + "</span> 件</p>";
      //テーブルタグ+一番左上セル
      insert += "<table><tbody><tr><th class='RowCol'></th>";
      //列ヘッダー
      for(let i=0;i<itemArr[0].length;i++){
        insert += "<th class='ColTh'>" + i + "</th>";
      }
      //行ヘッダー+行データ
      for(let i = 0; i <itemArr.length; i++){
        insert += "<tr><th class='RowTh'>"+i+"</th>";
        for(let j =0; j<itemArr[i].length; j++){
          insert += "<td>" + itemArr[i][j] + "</td>";
        }
        insert += "</tr>";
      }
      //閉じタグ
      insert += "</tr></tbody></table>";

      //完成したHTMLをリターン
      return insert;
    }


//============================================================
//↓定型構文end

  });
})(jQuery);
