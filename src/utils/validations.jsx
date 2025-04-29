

let forbidden_characters = `"',;/\\*=-+?؟:~!#$%^&(){}\`[]<>.`;
export function username_verification( username )
{
  let value = username;
   
  console.log('value', value);
  if (value.length <= 0 )
    return "يجب عليك إدخال اسم المستخدم " ;

  // one word , no spaces
  if (value.split(' ').length > 1)
      return 'اسم المستخدم يجب أن يتكون من كلمة واحدة فقط';
   
    // username length must be greater than 3 characters and smaller than  50 characters
    
    if (value.length > 50)
        return "يجب أن يكون اسم المستخدم أقل من 50 حرف ";

    if (value.length  <= 3 )
        return " يجب أن يكون اسم المستخدم أطول من 3 أحرف";

    // special characters like " ' , ; / \ * = - + ? : ~ ! # $ % ^ & ( ) { } ` are forbidden 

    for (let i = 0; i < forbidden_characters.length; i++)
    {
      if (value.includes(forbidden_characters[i]))
      {
          return "اسم المستخدم يحتوي على رمز غير صالح";
      }
    }


    return ''; // success case

}

export function email_verification( email ) {
  
  let value = email;

  if (value.length <= 0)
      return "يجب عليك أن تضع بريد إلكتروني";
 
  if (value.length <= 4)
        return "يجب أن يكون البريد الإلكتروني أطول من 4 أحرف";
    
  if (value.split(' ').length > 1)
    return 'لا يجب أن يحتوي البريد الإلكتروني على فراغات';
 
    return '';
}

export function phone_number_verification( phone ) {
    
    let value = phone;

    if (value.length <= 0)
      return "يجب عليك إدخال رقم هاتف سوري";

    for (let i = 0; i < value.length; i++)
    {
      if (value[i] > '9' || value[i] < '0' || value.length !== 10)
        return "الرقم المُدخل غير صالح , يجب إدخال رقم سوري";
    }

    return '';
}

export function first_last_name_verification( first_last_name )
{
  let value = first_last_name;

  if (value.length <= 0 )
    return "يجب أن تدخل اسماً" ;
   
    // first_name | last_name length must be greater than 3 characters and smaller than  50 characters
    
    if (value.length > 50)
        return "يجب أن يكون الاسم أقل من 50 حرف ";

    if (value.length  <= 1 )
        return " يجب أن يكون الاسم أطول من حرف  ";

    // special characters like " ' , ; / \ * = - + ? : ~ ! # $ % ^ & ( ) { } ` are forbidden 

    for (let i = 0; i < forbidden_characters.length; i++)
    {
      if (value.includes(forbidden_characters[i]))
      {
          return "الاسم المُدخل يحتوي على رمز غير صالح";
      }
    }

    return ''; // success case

}

export function password_verification(password) { 

  let value = password;
  
  if (value.length <= 0 )
    return "يجب عليك أن تضع كلمة مرور";

  if (value.length < 6)
    return "كلمة المرور قصيرة , يجب أن تتألف من 6 رموز على الأقل";

  if (value.length > 40)
    return " كلمة المرور يجب أن تكون أطول من 5 رموز";

  
  for (let i = 0; i < forbidden_characters.length; i++)
  {
    if (value.includes(forbidden_characters[i]))
      return "كلمة المرور تحتوي على رموز غير صالحة";
    }

    return '';

}

export function repeat_password_verification(password , repeat_password)
{
  let value = password;
  let value2 = repeat_password;

  if (value !== value2 )
    {
      return "إن كلمتا المرور غير متطابقتان ";
    }
    return ''; 
}